// proxy-server.js (ou proxy-server.ts se estiver usando TypeScript)
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para permitir CORS e processar JSON
app.use(cors());
app.use(bodyParser.json());

// Endpoint para receber e encaminhar os dados para o webhook
app.post('/api/webhook', async (req, res) => {
  console.log('Recebendo requisição no proxy:', req.body);
  
  try {
    const webhookUrl = 'https://webhook.site/ec3d02de-4f8f-412a-a5c4-1fa6b5b71425';
    console.log(`Encaminhando para ${webhookUrl}`);
    
    const response = await axios.post(webhookUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('Resposta do webhook:', response.status, response.data);
    res.status(response.status).json({
      success: true,
      message: 'Dados enviados com sucesso',
      data: response.data
    });
  } catch (error) {
    console.error('Erro ao encaminhar para webhook:', error);
    
    // Enviar informações detalhadas sobre o erro
    const errorResponse = {
      success: false,
      message: 'Erro ao enviar dados para o webhook',
      error: error.message
    };
    
    if (error.response) {
      errorResponse.statusCode = error.response.status;
      errorResponse.webhookResponse = error.response.data;
    }
    
    res.status(500).json(errorResponse);
  }
});

// Endpoint de verificação para testar se o servidor está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});