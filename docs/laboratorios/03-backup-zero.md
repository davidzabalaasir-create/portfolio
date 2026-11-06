# 03 · Backup Zero — estrategia 3-2-1 automatizada

**Objetivo:** proteger los datos de `srv-01` con la regla **3-2-1** — 3 copias de los datos, en 2 soportes distintos, 1 de ellas fuera del sitio — y demostrar que las copias **se pueden restaurar**.

```text
 Copia 1 (original)        Copia 2 (otro equipo)              Copia 3 (fuera del sitio)
 srv-01:/srv/datos  ──►  backup-01:/backups/srv-01/<fecha>  ──►  archivo .tar.gz.gpg cifrado
                     rsync + SSH                             en disco externo / carpeta en la nube
                     snapshots con --link-dest
```

**Requisitos:** `srv-01` y `backup-01` (Ubuntu Server) en la misma red. `backup-01` con un segundo disco virtual de 20 GB para las copias.

## 1. Datos de ejemplo en srv-01

```bash
sudo mkdir -p /srv/datos/{web,config,documentos}
sudo cp -r /etc/nginx /srv/datos/config/ 2>/dev/null || true
for i in $(seq 1 50); do echo "documento $i - $(date)" | sudo tee /srv/datos/documentos/doc$i.txt >/dev/null; done
sudo chown -R $USER: /srv/datos
du -sh /srv/datos
```

## 2. Disco de copias en backup-01

En VirtualBox añade un segundo disco (20 GB) a `backup-01`. Luego:

```bash
lsblk                                  # localiza el disco nuevo (p. ej. /dev/sdb)
sudo mkfs.ext4 -L backups /dev/sdb
sudo mkdir -p /backups
echo 'LABEL=backups /backups ext4 defaults 0 2' | sudo tee -a /etc/fstab
sudo mount -a && df -h /backups
sudo useradd -m -s /bin/bash backup
sudo mkdir -p /backups/srv-01 && sudo chown backup: /backups/srv-01
```

📸 **Captura `03-backup-01-disco.png`:** `lsblk` y `df -h /backups` en `backup-01`.

## 3. Acceso SSH sin contraseña (solo para las copias)

En `srv-01`:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/backup_ed25519 -N "" -C "backup srv-01"
ssh-copy-id -i ~/.ssh/backup_ed25519.pub backup@IP_DE_BACKUP01
ssh -i ~/.ssh/backup_ed25519 backup@IP_DE_BACKUP01 hostname
```

## 4. Script de copia — `/usr/local/bin/backup-zero.sh`

```bash
#!/usr/bin/env bash
# Backup Zero: copia incremental con snapshots (rsync --link-dest) + copia cifrada fuera del sitio.
set -euo pipefail

ORIGEN="/srv/datos/"
DESTINO="backup@IP_DE_BACKUP01:/backups/srv-01"
CLAVE_SSH="$HOME/.ssh/backup_ed25519"
OFFSITE="/mnt/offsite"                     # disco externo o carpeta sincronizada con la nube
GPG_PASS_FILE="$HOME/.backup-zero.pass"    # chmod 600; NO subir nunca a GitHub
RETENCION=7                                # snapshots que se conservan
FECHA="$(date +%F_%H%M)"
LOG="/var/log/backup-zero.log"

log() { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }
SSH="ssh -i $CLAVE_SSH"
HOST="${DESTINO%%:*}"; RUTA="${DESTINO#*:}"

log "Inicio de copia $FECHA"

# Copia 2: snapshot incremental; los archivos sin cambios son enlaces duros al snapshot anterior
rsync -a --delete -e "$SSH" --link-dest="$RUTA/ultimo" "$ORIGEN" "$DESTINO/$FECHA/"
$SSH "$HOST" "ln -sfn '$RUTA/$FECHA' '$RUTA/ultimo'"
log "Snapshot $FECHA creado en $HOST"

# Retención: borra los snapshots más antiguos
$SSH "$HOST" "cd '$RUTA' && ls -1d 20*/ 2>/dev/null | head -n -$RETENCION | xargs -r rm -rf"
log "Retención aplicada ($RETENCION snapshots)"

# Copia 3: archivo comprimido y cifrado con AES-256 fuera del sitio
mkdir -p "$OFFSITE"
tar -czf - -C "$ORIGEN" . \
  | gpg --batch --yes --symmetric --cipher-algo AES256 --passphrase-file "$GPG_PASS_FILE" \
  -o "$OFFSITE/srv-01_$FECHA.tar.gz.gpg"
sha256sum "$OFFSITE/srv-01_$FECHA.tar.gz.gpg" > "$OFFSITE/srv-01_$FECHA.sha256"
ls -1t "$OFFSITE"/srv-01_*.tar.gz.gpg | tail -n +$((RETENCION + 1)) | xargs -r rm -f
log "Copia cifrada fuera del sitio: srv-01_$FECHA.tar.gz.gpg"

log "Copia terminada correctamente"
```

```bash
sudo install -m 755 backup-zero.sh /usr/local/bin/backup-zero.sh
openssl rand -base64 32 > ~/.backup-zero.pass && chmod 600 ~/.backup-zero.pass
sudo touch /var/log/backup-zero.log && sudo chown $USER: /var/log/backup-zero.log
sudo mkdir -p /mnt/offsite && sudo chown $USER: /mnt/offsite   # en un caso real, un disco externo montado aquí
/usr/local/bin/backup-zero.sh
```

> **Guarda la contraseña de `~/.backup-zero.pass` en un gestor de contraseñas.** Sin ella la copia cifrada no se puede recuperar.

📸 **Captura `03-backup-02-ejecucion.png`:** ejecución del script con el log de cada paso.
📸 **Captura `03-backup-03-snapshots.png`:** en `backup-01`, `ls -l /backups/srv-01` mostrando varios snapshots y el enlace `ultimo`, y `du -sh /backups/srv-01/*` (los snapshots incrementales ocupan muy poco).

## 5. Automatizar con systemd

`/etc/systemd/system/backup-zero.service`

```ini
[Unit]
Description=Backup Zero - copia 3-2-1 de srv-01
Wants=network-online.target
After=network-online.target

[Service]
Type=oneshot
User=TU_USUARIO
ExecStart=/usr/local/bin/backup-zero.sh
```

`/etc/systemd/system/backup-zero.timer`

```ini
[Unit]
Description=Ejecuta Backup Zero cada día a las 02:30

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now backup-zero.timer
systemctl list-timers backup-zero.timer
```

📸 **Captura `03-backup-04-timer.png`:** `systemctl list-timers` con la próxima ejecución.

## 6. Prueba de restauración (la parte más importante)

**a) Restaurar un archivo borrado desde el snapshot:**

```bash
rm /srv/datos/documentos/doc7.txt
rsync -a -e "ssh -i ~/.ssh/backup_ed25519" \
  backup@IP_DE_BACKUP01:/backups/srv-01/ultimo/documentos/doc7.txt /srv/datos/documentos/
cat /srv/datos/documentos/doc7.txt
```

**b) Restaurar todo desde la copia cifrada y verificar la integridad:**

```bash
ULTIMA=$(ls -1t /mnt/offsite/srv-01_*.tar.gz.gpg | head -1)
sha256sum -c "${ULTIMA%.tar.gz.gpg}.sha256"           # debe decir: La suma coincide / OK
mkdir -p /tmp/restauracion
gpg --batch --decrypt --passphrase-file ~/.backup-zero.pass "$ULTIMA" | tar -xzf - -C /tmp/restauracion
diff -r /srv/datos /tmp/restauracion && echo "RESTAURACIÓN VERIFICADA: idéntico al original"
```

Anota cuánto tarda la restauración completa: es tu **RTO** (tiempo de recuperación). La frecuencia de la copia (cada 24 h) es tu **RPO** (datos que podrías perder).

📸 **Captura `03-backup-05-restaurar-archivo.png`:** archivo borrado y recuperado.
📸 **Captura `03-backup-06-verificacion.png`:** `sha256sum -c` correcto y el mensaje *RESTAURACIÓN VERIFICADA* ⭐.

## Capturas — resumen

| Archivo | Qué debe verse |
| :-- | :-- |
| `03-backup-01-disco.png` | Disco de copias montado |
| `03-backup-02-ejecucion.png` | Log del script |
| `03-backup-03-snapshots.png` | Snapshots incrementales |
| `03-backup-04-timer.png` | Timer de systemd |
| `03-backup-05-restaurar-archivo.png` | Recuperación de un archivo |
| `03-backup-06-verificacion.png` | Restauración completa verificada ⭐ |

## Conclusiones (rellenar)

- **RPO y RTO obtenidos:**
- **Problemas y cómo los resolví:**
- **Siguiente paso:** avisos si la copia falla (`OnFailure=` en systemd), copia offsite real en la nube con `rclone`, o probar `restic`.
