


export const headerTypes = {
  acaOrigin:      'Access-Control-Allow-Origin',
  acaHeaders:     'Access-Control-Allow-Headers',
  acaMethods:     'Access-Control-Allow-Methods',
  acaCredentials: 'Access-Control-Allow-Credentials',
};

export const headerValues = {
  /* aca - Access-Control-Allow-[...] */
  acaOrigin:      'https://localhost:5173', 
  acaHeaders:     'Origin, X-Requested-With, Content-Type, Accept',
  acaMethods:     'GET, POST, DELETE, PUT',
  acaCredentials: 'true',
};