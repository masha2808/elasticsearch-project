import { useContext, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { ProgrammingListContext } from "./context/programming-list-context";
import ProgrammingList from "./programming-list";

const programmingListPage = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  py: 3,
}

function ProgrammingIndex() {
  const programmingList = useContext(ProgrammingListContext);

  const handleCreateIndex = async () => {
    await programmingList.createIndex();
  }

  const search = async () => {
    if (programmingList.isIndex) {
      await programmingList.search();
    }
  }

  useEffect(() => {
    search();
  }, [programmingList.isIndex]);

  return (
    <Box component="div" sx={programmingListPage}>
      {programmingList.isIndex ?
        <ProgrammingList /> : null
      }
      {programmingList.isIndex === false ?
        <Button variant="contained" onClick={handleCreateIndex}>Create index</Button> : null
      }
    </Box>
  );
}

export default ProgrammingIndex;
