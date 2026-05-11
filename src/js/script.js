//Declarações dos elementos html para o dom

const videoElemento = document.getElementById("video");
const botaoScanner = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

//metodo ligar camera

async function configurarCamera(){
    try{
        //solicita a permissão para acessar a camera do usuario
        const midia = await navigator.mediaDevices.getUserMedia({
            //habilita a camera traseira do celular
            video:{ facingMode:"enviroment"},
            audio:false
        });
        //atribui o fluxo da camera ao elemento de video para visualizar
        videoElemento.srcObject = midia;
    }catch(erro){
        resultado.innerText="Erro ao acessar a camera",erro;
    }
}

//executa a função para habilitar camera
configurarCamera();

//capturar o texto da camera 

botaoScanner.onclick =async()=>{
    //desativa o botao para evitar multiplos cliques 
    botaoScanner.disabled = true;
    resultado.innerText ="fazendo a leitura..... Aguarde";

    //captura a imagem(foto)
    const context = canvas.getContext("2d")

    //ajusta o tamanho do canvas, interno para ser igual a do video 
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    //desenha o frame atual do video dentro do canvas(tira a foto)
    contexto.drawImage(videoElemento,0,0,canvas.canvas.height);

    //processando com a api Tesseract
    try{
        //função do Tesseract
        const {data:{text}}= await Tesseract.recognize(
            canvas, //a imagem que acabou e capturar 
            'por', // idioma em portugues
            {looger: m=>console.log(m)} //mostra no log
        )
        resultado.innerText = text.trim().length > 0 ? text : "não foi possivel identificar o texto";
    }catch(erro){
        //resultado caso apresente um erro
        resultado.innerText="Erro no processamento",erro.message;
    }
    finally{
        //habilita o botão para uma nova leitura
        botaoScanner.disabled=false;
    }
}