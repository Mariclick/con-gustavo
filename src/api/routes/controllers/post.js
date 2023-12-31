import OpenAI from "openai";
import User from "../../../models/users.js";
import { openAiApiKey } from "../../../config/index.js";


const archetypes = {
  sabio: {
    name: "sabio",
    description:
      "Quiero que el texto me haga sentir que leo la verdad absoluta.",
    keywords: "Conocedor, Confiable, Poderoso.",
  },
  inocente: {
    name: "inocente",
    description:
      "Quiero que el texto me hagas sentir que todo es bello y feliz.",
    keywords: "Tranquilidad, Felicidad, satisfacción.",
  },
  gobernante: {
    name: "gobernante",
    description: "Me hace sentir con el texto que eres un líder imponente.",
    keywords: "Prestígio, Liderazgo, Poder.",
  },
  comun: {
    name: "comun",
    description:
      "Vives una vida común, pero se va convertir en una persona mejor.",
    keywords: "mérito, esfuerzo, vida tranquila.",
  },
  cuidador: {
    name: "cuidador",
    description: "Se sientas confortable, protegido .",
    keywords: "Amabilidad, cuidado, anidado.",
  },
  amante: {
    name: "amante",
    description: "Nos da deseo y demuestra fidelidad.",
    keywords: "Amor, Lealtad, Fijación.",
  },
  bufon: {
    name: "bufon",
    description: "Quiero que el texto me haga reir.",
    keywords: " Cómico, humor, fantasía.",
  },
  rebelde: {
    name: "rebelde",
    description: "Quero texto me haga sentir que puedo romper reglas.",
    keywords: "Rebeldía, obstinación y oposición.",
  },
  explorador: {
    name: "explorador",
    description:
      "Quiero que me haga sentir que vamos a descubrir algo nuevo, o que me llevas en una aventura.",
    keywords: "Sin límites, pionero, explorador.",
  },
  creativo: {
    name: "creativo",
    description: " Quiero que el texto despierte mi imaginación.",
    keywords: "Imaginación, Invención, Creatividad.",
  },
  heroe: {
    name: "heroe",
    description:
      "Quiere que el texto me haga creer que puedo superar desafíos con valentía sobrepasar los  límites.",
    keywords: "Grandiosidad, resistencia, inspiración.",
  },
  mago: {
    name: "mago",
    description:
      "Quiero que el texto me haga sentir que todo se resuelve de forma sencilla.",
    keywords: "Libertad, magia, facilidad, geniosidad.",
  },
};

const createUser = async (req, res) => {
  try {
    
    const delimitadores = /\$\$\$ (.*?) \$\$\$/g;
    const regex = /\$\$\$.*?\$\$\$/g;
    let match;
    let saveMongo;

    // Promise.all
    const responseAi = await generateStory(req.body);
    let responseAiText = responseAi.replace(regex, '');
    let responseAiHash = [];
    
    while ((match = delimitadores.exec(responseAi)) !== null) {
      responseAiHash.push(match[1]);
    }
    
    if (responseAiHash.length > 0) {
      req.body.responseAiHash = responseAiHash[0];
    } else {
      // Manejar el caso en el que no se encontraron coincidencias
      console.error('No se encontraron coincidencias en responseAiHash');
    }

  
    req.body.responseAi = responseAi;
    req.body.responseAiText = responseAiText;

    const mongoResponse = await User.create(req.body);

    if (mongoResponse) {
      res.status(201).json({
        status: "Creado",
        responseAiText: responseAiText,
        responseAiHash: req.body.responseAiHash,
        mongoResponse,
      });
    } else {
      // Si hubo algún problema al guardar en MongoDB, puedes manejarlo aquí
      res.status(500).json({ message: "Error al guardar en la base de datos" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Hay un error" });
  }
};

export { createUser };

async function generateStory(storyConfigs) {
  const openAiInstance = new OpenAI({ apiKey: openAiApiKey });
  const {
    nombre,
    empresa,
    mision,
    genero,
    protagonista,
    objetivo,
    motivacion,
    malo,
    ayudante,
    actitud,
    mensaje,
    comportamiento,
  } = storyConfigs;

  const mensajeUsuario = `####Contexto#####

    Tu eres un experto en campañas publicitarias y estás ayudando a una empresa a crear su Transmedia Storytelling que represente la identidad de la marca y la importancia de su servicio/producto. Estos son los datos del cliente:

    Nombre de la campaña: ${nombre}
    Nombre de la Marca: ${empresa}
    Descripción del producto: ${mision}

    #########Instrucción##########:
    Crea un Storytelling en que el tono comunicativo es: ${archetypes[comportamiento].keywords}

    a demostrar que la marca representada tiene un posicionamiento de que: ${archetypes[comportamiento].description}. Con base en los siguientes requisitos narrativos:

    El protagonista de la historia es ${protagonista}
    El género del protagonista es ${genero}
    El protagonista tiene como objetivo ${objetivo}
		El protagonista es motivado por ${motivacion}
    Pero, ${malo} impide el protagonista a cumplir su objetivo
    ${ayudante} ayuda el protagonista
    La actitud que tiene el ayudante es ${actitud}
    En el fin, ${mensaje}

    #########Forma##########:

    Primero, escribe sin titulo el storytelling con 750 caracteres. Acá no va el contenido para redes sociales, va en el segundo texto.

    Segundo, escribe sin titulo otro texto más corto de 180 caracteres conteniendo hashtags y emojis, para divulgación en las redes sociales de la misma narrativa. Muy importante: este segunto texto para redes sociales debe de ir de último, comenzando con "$$$" y terminando con "$$$".`;




  const chatCompletion = await openAiInstance.chat.completions.create({
    messages: [{ role: "user", content: mensajeUsuario,  }],
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    
  });
 

  return chatCompletion.choices[0].message.content;
}
