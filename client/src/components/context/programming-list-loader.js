import { useState, useEffect } from "react";
import { ProgrammingListContext } from "./programming-list-context";

export const ProgrammingListLoader = (props) => {
  const [data, setData] = useState([]);
  const [isIndex, setIsIndex] = useState();
  const [filterMap, setFilterMap] = useState();

  const programmingList = {
    data,
    isIndex,
    filterMap,
    createIndex: async () => {
      fetch('/api/programming/createIndex', {
        method: 'POST',
      })
        .then(data => data.json())
        .then(res => {
          setIsIndex(res.isExisted);
        })
        .catch(() => {
          window.alert('Error while creating index.');
        });
    },
    checkIndex: async () => {
      fetch('/api/programming/checkIndex', {
        method: 'GET',
      })
        .then(data => data.json())
        .then(res => {
          setIsIndex(res.isExisted);
        })
        .catch(() => {
          window.alert('Error while checking index.');
        });
    },
    deleteIndex: async () => {
      fetch('/api/programming/deleteIndex', {
        method: 'DELETE',
      })
        .then(data => data.json())
        .then(res => {
          setIsIndex(res.isExisted);
        })
        .catch(() => {
          window.alert('Error while deleting index.');
        });
    },
    create: async (programming) => {
      fetch('/api/programming/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(programming)
      })
        .then(data => data.json())
        .then(res => {
          setData([...data, res]);
        })
        .catch(() => {
          window.alert('Error while creating.');
        });
    },
    delete: async (id) => {
      fetch(`/api/programming/delete/${id}`, {
        method: 'DELETE',
      })
        .then(data => data.json())
        .then(res => {
          setData(data.filter(item => item.id !== id));
        })
        .catch(() => {
          window.alert('Error while creating.');
        });
    },
    search: async (filterMap) => {
      fetch(`/api/programming/search?${new URLSearchParams(filterMap)}`, {
        method: 'GET',
      })
        .then(data => data.json())
        .then(res => {
          console.log(res)
          setData(res);
          setFilterMap(filterMap);
        })
        .catch((e) => {
          window.alert('Error while searching.');
        });
    },
  }

  async function setInitialValue() {
    await programmingList.checkIndex();
    if (programmingList.isIndex) {
      await programmingList.search();
    }
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <ProgrammingListContext.Provider value={programmingList}>
      {props.children}
    </ProgrammingListContext.Provider>
  );
};