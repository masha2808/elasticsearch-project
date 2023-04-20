import { useState, useContext } from "react";
import { Modal, Box, Typography, TextField, FormLabel, Button, IconButton, Icon } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProgrammingListContext } from "./context/programming-list-context";

const boxStyle = {
  position: "absolute",
  overflowY: "auto",
  maxHeight: "90vh",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "none",
  borderRadius: 2,
  outline: "none",
  boxShadow: 24,
  py: 3,
  px: 4,
};

const inputStyle = (width) => {
  return {
    width: width || "100%",
    border: "1px solid gray",
    borderRadius: 1,
    my: 0.5
  }
};

const labelStyle = {
  color: "black",
  display: "block",
  my: 0.5
}

const paradigmBox = {
  display: "flex",
  justifyContent: "space-between"
}

const formButtons = {
  display: "flex",
  justifyContent: "right",
  gap: "8px",
  my: 0.5
}

function CreateForm(props) {
  const { isModalOpened, setIsModalOpened } = props;
  const programmingList = useContext(ProgrammingListContext);
  const [paradigmArray, setParadigmArray] = useState([{ id: 1 }]);
  const [userAmount, setUserAmount] = useState();

  const handleAdd = () => {
    setParadigmArray([...paradigmArray, {
      id: paradigmArray.at(-1).id + 1
    }]);
  }

  const handleDelete = (id) => {
    setParadigmArray(paradigmArray.filter(paradigm => paradigm.id !== id));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await programmingList.create({
      programmingLanguage: e.target.elements["programming-language"].value,
      paradigm: paradigmArray.map(paradigm => e.target.elements[`paradigm-${paradigm.id}`].value),
      dateCreation: e.target.elements["date-creation"].value,
      userAmount: e.target.elements["users-amount"].value,
      description: e.target.elements["description"].value,
      history: e.target.elements["history"].value,
      usage: e.target.elements["usage"].value
    });
    console.log(programmingList.filterMap)
    await programmingList.search(programmingList.filterMap);
    setIsModalOpened(false);
  }

  const handleCancel = () => {
    setIsModalOpened(false);
  }

  return (
    <Modal open={isModalOpened}>
      <Box sx={boxStyle}>
        <form onSubmit={handleSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h5" gutterBottom>
              Add programming language
            </Typography>
            <FormLabel sx={labelStyle} required>Programming language</FormLabel>
            <TextField
              hiddenLabel
              name="programming-language"
              variant="outlined"
              size="small"
              sx={() => inputStyle()}
              required
            />
            <FormLabel sx={labelStyle} required>Paradigm</FormLabel>
            {paradigmArray.map(paradigm => (
              <Box component="div" key={paradigm.id} sx={paradigmBox}>
                <TextField
                  hiddenLabel
                  name={`paradigm-${paradigm.id}`}
                  variant="outlined"
                  size="small"
                  sx={() => inputStyle(452)}
                  required
                />
                <IconButton color="primary" disabled={paradigmArray.length === 1} onClick={() => handleDelete(paradigm.id)}>
                  <Icon size="large">
                    <DeleteIcon />
                  </Icon>
                </IconButton>
              </Box>
            ))}
            <IconButton color="primary" onClick={handleAdd}>
              <Icon size="large">
                <AddIcon />
              </Icon>
            </IconButton>
            <FormLabel sx={labelStyle} required>Date creation</FormLabel>
            <DatePicker
              hiddenLabel
              type="date"
              variant="outlined"
              sx={() => inputStyle()}
              slotProps={{ textField: { size: 'small', name: "date-creation", required: true } }}
            />
            <FormLabel sx={labelStyle} required>Amount of developers, who use this programming language</FormLabel>
            <TextField
              hiddenLabel
              name="users-amount"
              type="number"
              variant="outlined"
              size="small"
              sx={() => inputStyle()}
              value={userAmount}
              InputProps={{ inputProps: { min: 0 } }}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (value < 0) {
                  setUserAmount(0);
                }
                else {
                  setUserAmount(value);
                }
              }}
              required
            />
            <FormLabel sx={labelStyle} required>Description</FormLabel>
            <TextField
              hiddenLabel
              name="description"
              type="text"
              variant="outlined"
              size="small"
              multiline
              rows={2}
              sx={() => inputStyle()}
              required
            />
            <FormLabel sx={labelStyle} required>History</FormLabel>
            <TextField
              hiddenLabel
              name="history"
              type="text"
              variant="outlined"
              size="small"
              multiline
              rows={2}
              sx={() => inputStyle()}
              required
            />
            <FormLabel sx={labelStyle} required>Usage</FormLabel>
            <TextField
              hiddenLabel
              name="usage"
              type="text"
              variant="outlined"
              size="small"
              multiline
              rows={2}
              sx={() => inputStyle()}
              required
            />
            <Box component="div" sx={formButtons}>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="submit" variant="contained">Submit</Button>
            </Box>
          </LocalizationProvider>
        </form>
      </Box>
    </Modal>
  )
}

export default CreateForm;