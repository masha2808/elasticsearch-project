const { Client } = require('@elastic/elasticsearch')
const moment = require("moment");
require('dotenv').config();

const index = "programming-index-lab3";
const client = new Client({
  node: "http://127.0.0.1:9200",
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD
  }
});

const createIndex = async () => {
  const isExisted = await client.indices.exists({ index });
  if (!isExisted) {
    await client.indices.create({ 
      index,
      settings: {
        analysis: {
          analyzer: {
            standard_analyzer: {
              type: "standard",
              max_token_length: 10,
              stopwords: "_english_"
            },
            custom_analyzer: {
              type: "custom",
              tokenizer: "standard",
              char_filter: [
                "html_strip"
              ],
              filter: [
                "lowercase",
                "stemmer",
                "synonym"
              ]
            }
          },
          filter: {
            synonym: {
              type: "synonym",
              lenient: true,
              synonyms: [
                "javascript => js",
                "user experience => ux",
                "server-side => backend",
                "IoT => internet of things"
              ]
            }
          }
        }
      },
      mappings: {
        properties: {
          programmingLanguage: { type: "keyword" },
          paradigm: { type: "keyword" },
          dateCreation: { type: "date" },
          userAmount: { type: "integer" },
          description: { type: "text", analyzer: "standard_analyzer" },
          history: { type: "text", analyzer: "english" },
          usage: { type: "text", analyzer: "custom_analyzer" },
        }
      }
    });
  }
}

const checkIndex = async () => {
  return await client.indices.exists({ index });
}

const deleteIndex = async () => {
  await client.indices.delete({ index });
}

const create = async (programming) => {
  const result = await client.create({
    id: Math.random().toString(36).slice(2),
    index,
    document: {
      ...programming,
      dateCreation: moment(programming.dateCreation).format("YYYY-MM-DD")
    }
  });
  return await client.get({
    id: result._id,
    index,
  });
}

const remove = async (id) => {
  return await client.delete({
    id,
    index,
  });
}

const search = async (filterMap) => {
  if (Object.keys(filterMap).length > 0) {
    let query = {};
    if (filterMap.userAmountFrom || filterMap.userAmountTo) {
      query.range = {
        userAmount: {}
      }
      if (filterMap.userAmountFrom && !isNaN(filterMap.userAmountFrom)) {
        query.range.userAmount.gte = filterMap.userAmountFrom;
      }
      if (filterMap.userAmountTo && !isNaN(filterMap.userAmountTo)) {
        query.range.userAmount.lte = filterMap.userAmountTo;
      }
    }

    if (filterMap.dateCreationFrom || filterMap.dateCreationTo) {
      let range = {
        dateCreation: {}
      };
      if (filterMap.dateCreationFrom) {
        range.dateCreation = {
          gte: filterMap.dateCreationFrom
        };
      }
      if (filterMap.dateCreationTo) {
        range.dateCreation = {
          ...range.dateCreation,
          lte: filterMap.dateCreationTo
        }
      }
      if (query.range) {
        query = {
          bool: {
            must: [
              { range: query.range },
              { range }
            ]
          }
        }
      } else {
        query.range = range
      }
    }

    if (filterMap.termSearch) {
      const term = {
        programmingLanguage: filterMap.termSearch
      };
      if (query.range) {
        query = {
          bool: {
            must: [
              { range: query.range },
              { term }
            ]
          }
        }
      } else if (query.bool) {
        query.bool.must.push({ term });
      } else {
        query.term = term;
      }
    }

    if (filterMap.regexSearch) {
      const regexp = {
        paradigm: {
          value: `.*${filterMap.regexSearch}.*`,
          case_insensitive: true
        }
      };
      if (query.range) {
        query = {
          bool: {
            must: [
              { range: query.range },
              { regexp }
            ]
          }
        }
      } else if (query.term) {
        query = {
          bool: {
            must: [
              { term: query.term },
              { regexp }
            ]
          }
        }
      } else if (query.bool) {
        query.bool.must.push({ regexp });
      } else {
        query.regexp = regexp;
      }
    }

    if (filterMap.matchSearchQuery) {
      const match = {}
      match[filterMap.matchSearchField] = filterMap.matchSearchQuery;
      if (query.range) {
        query = {
          bool: {
            must: [
              { range: query.range },
              { match }
            ]
          }
        }
      } else if (query.term) {
        query = {
          bool: {
            must: [
              { term: query.term },
              { match }
            ]
          }
        }
      } else if (query.bool) {
        query.bool.must.push({ match });
      } else {
        query.match = match;
      }
    }
    return await client.search({
      index,
      query
    });
  } else {
    return await client.search({
      index,
      query: {
        match_all: {}
      }
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