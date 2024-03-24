#!/bin/bash
#DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# ssh 
PRODUCAO_SERVIDOR=
PRODUCAO_USUARIO=root
PRODUCAO_SSH=$PRODUCAO_USUARIO@$PRODUCAO_SERVIDOR
PRODUCAO_SSH_COMMAND="ssh -t"

function criar_image {
    docker rmi test
    docker build -t test:latest -f Dockerfile_hom .
}

function producao_parar() {
    $PRODUCAO_SSH_COMMAND $PRODUCAO_SSH "docker container stop test || true"
    $PRODUCAO_SSH_COMMAND $PRODUCAO_SSH "docker rm -f test || true"
}

function upload_image_server {
    $PRODUCAO_SSH_COMMAND $PRODUCAO_SSH "docker image rm -f test || true"
    docker save test:latest | bzip2 | pv | $PRODUCAO_SSH_COMMAND $PRODUCAO_SSH 'bunzip2 | docker load'
}

function producao_log() {
    $PRODUCAO_SSH_COMMAND $PRODUCAO_SSH "docker logs -f test"
}

function producao_iniciar() {
    $PRODUCAO_SSH_COMMAND $PRODUCAO_SSH "docker run -d --restart always -p 3000:3000 --network api_jd_backend --name test test:latest"
}

function desenvolvimento() {
    echo "Criando docker localmente"
    criar_image
    echo "imagem criada"
    echo "criando container"
    docker run -p 3000:3000 --rm --network documentos_default  --name test test
    echo "container criado"
}

function producao {
    echo "[Criando] imagem"
    criar_image
    echo "[Imagem Criada] "
    upload_image_server
    echo "[upload feito] "
    echo "[producao parar] "
    producao_parar
    echo "[produção parada] "
    echo "[criando container] "
    producao_iniciar
    sleep 5s
    echo "[mostrar logs] "
    producao_log
}

PS3='Selecione uma opção: '
options=("Produção" "Produção Logs" "Conectar" "Desenvolvimento" "Sair")
select opt in "${options[@]}"
do
    case $opt in
        "Produção")
            producao;
            break;
            ;;
        "Produção Logs")
            producao_log;
            break
            ;;
        "Conectar")
            $PRODUCAO_SSH_COMMAND $PRODUCAO_SSH
            break
            ;;
        "Desenvolvimento")
            desenvolvimento;
            break
            ;;
        "Sair")
            break
            ;;
        *) echo invalid option;;
    esac
done