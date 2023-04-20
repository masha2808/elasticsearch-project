const programmingService = require('../services/programming-service');

const createIndex = async (req, res) => {
  try {
    await programmingService.createIndex();
    isExisted = await programmingService.checkIndex();
    res.status(200).send({
      isExisted
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message || error
    });
  }
}

const checkIndex = async (req, res) => {
  try {
    isExisted = await programmingService.checkIndex();
    res.status(200).send({
      isExisted
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message || error
    });
  }
}

const deleteIndex = async (req, res) => {
  try {
    await programmingService.deleteIndex();
    isExisted = await programmingService.checkIndex();
    res.status(200).send({
      isExisted
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message || error
    });
  }
}

const create = async (req, res) => {
  try {
    programming = await programmingService.create(req.body);
    res.status(200).send({
      id: programming._id,
      ...programming._source
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message || error
    });
  }
}

const remove = async (req, res) => {
  try {
    const removed = await programmingService.remove(req.params.id);
    res.status(200).send({
      isDeleted: true
    });
  } catch (error) {
    res.status(400).send({
      "message": error.message || error
    });
  }
}

const search = async (req, res) => {
  try {
    programmingList = await programmingService.search(req.query);
    res.status(200).send(programmingList.hits.hits.map(item => {
      return {
        id: item._id,
        ...item._source
      }
    }));
  } catch (error) {
    res.status(400).send({
      "message": error.message || error
    });
  }
}

module.exports = { 
  createIndex,
  checkIndex,
  deleteIndex,
  create,
  remove,
  search
};