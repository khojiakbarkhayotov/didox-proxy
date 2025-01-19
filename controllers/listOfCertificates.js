import getListOfAllCertificates from '../services/listOfAllCertificates.js'

const getList = async (req, res, next) => {
    try {
        getListOfAllCertificates(res); 
    } catch (e) {
      console.error('Error in getList:', e.message);
      // Send error response only if a response hasn't already been sent
      if (!res.headersSent) {
        res.status(500).send({ error: 'Internal Server Error' });
      }
    }
  };

  

export default getList;