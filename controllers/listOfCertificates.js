import getListOfAllCertificates from '../services/listOfAllCertificates.js';

const getList = async (req, res) => {
  try {
    const certificates = await getListOfAllCertificates();
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error in getList:', error.message);

    // Send error response
    res.status(500).json({ error: error.message });
  }
};

export default getList;
