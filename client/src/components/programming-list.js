import { useContext, useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Icon } from "@mui/material";
import { ProgrammingListContext } from "./context/programming-list-context";
import DeleteIcon from '@mui/icons-material/Delete';
import CreateForm from "./create-form";
import Filters from "./filters";

const programmingListPage = {
  display: "flex",
  flexDirection: "row",
  gap: 3,
  py: 3,
  px: 3,
}

const table = {
  width: "1250px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;"
}

const button = {
  alignSelf: "stretch",
  my: 1
}

const filterPanel = {
  display: "flex",
  flexDirection: "column"
}

function ProgrammingList() {
  const programmingList = useContext(ProgrammingListContext);

  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleAdd = () => {
    setIsModalOpened(true);
  }

  const handleDelete = (id) => {
    programmingList.delete(id);
  }

  const handleDeleteIndex = async () => {
    await programmingList.deleteIndex();
  }

  return (
    <Box component="div" sx={programmingListPage}>
      <Box component="div" sx={filterPanel} width={350}>
        <Button variant="contained" sx={button} onClick={handleAdd}>Add programming language</Button>
        <Filters />
        <Button variant="contained" color="error" sx={button} onClick={handleDeleteIndex}>Delete index</Button>
      </Box>
      <Box component="div" width={1250}>
        <TableContainer component={Paper} sx={table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left"><b>Programing language</b></TableCell>
                <TableCell align="left"><b>Paradigm</b></TableCell>
                <TableCell align="left" width={95}><b>Date creation</b></TableCell>
                <TableCell align="left"><b>Amount of users</b></TableCell>
                <TableCell align="left"><b>Description</b></TableCell>
                <TableCell align="left"><b>History</b></TableCell>
                <TableCell align="left"><b>Usage</b></TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {programmingList?.data?.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left">{row.programmingLanguage}</TableCell>
                  <TableCell align="left">
                    <ul style={{ paddingLeft: "16px" }}>
                      {row.paradigm?.map(item => (
                        <li>{item}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell align="left">{row.dateCreation}</TableCell>
                  <TableCell align="left">{row.userAmount}</TableCell>
                  <TableCell align="left">{row.description}</TableCell>
                  <TableCell align="left">{row.history}</TableCell>
                  <TableCell align="left">{row.usage}</TableCell>
                  <TableCell align="left">
                    <IconButton color="primary" onClick={() => handleDelete(row.id)}>
                      <Icon size="large">
                        <DeleteIcon />
                      </Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <CreateForm isModalOpened={isModalOpened} setIsModalOpened={setIsModalOpened} />
    </Box>
  );
}

export default ProgrammingList;
