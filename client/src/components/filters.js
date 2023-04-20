import { useState, useContext } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import { ProgrammingListContext } from "./context/programming-list-context";

const inputStyle = {
  borderRadius: 1,
  my: 0.5
};

const dateRange = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
}

const button = {
  width: "171px",
  my: 1
}

function Filters() {
  const programmingList = useContext(ProgrammingListContext);
  const [dateCreationFrom, setDateCreationFrom] = useState();
  const [dateCreationTo, setDateCreationTo] = useState();
  const [userAmountFrom, setUserAmountFrom] = useState();
  const [userAmountTo, setUserAmountTo] = useState();
  const [termSearch, setTermSearch] = useState("");
  const [regexSearch, setRegexSearch] = useState("");
  const [matchSearchField, setMatchSearchField] = useState("description");
  const [matchSearchQuery, setMatchSearchQuery] = useState("");

  const searchWithFilters = async () => {
    if (userAmountFrom && userAmountTo && userAmountFrom >= userAmountTo) {
      window.alert("Wrong user amount from and to values");
      return;
    }
    if (dateCreationFrom && dateCreationTo && !dayjs(dateCreationTo).isAfter(dateCreationFrom)) {
      window.alert("Wrong date creation from and to values");
      return;
    }
    const filterMap = {
    };
    if (userAmountFrom) {
      filterMap.userAmountFrom = userAmountFrom;
    }
    if (userAmountTo) {
      filterMap.userAmountTo = userAmountTo;
    }
    if (dateCreationFrom) {
      filterMap.dateCreationFrom = dayjs(dateCreationFrom).toISOString();
    }
    if (dateCreationTo) {
      filterMap.dateCreationTo = dayjs(dateCreationTo).toISOString();
    }
    if (termSearch) {
      filterMap.termSearch = termSearch;
    }
    if (regexSearch) {
      filterMap.regexSearch = regexSearch;
    }
    if (matchSearchQuery) {
      filterMap.matchSearchField = matchSearchField;
      filterMap.matchSearchQuery = matchSearchQuery;
    }
    await programmingList.search(filterMap);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    searchWithFilters();
  }

  const handleClearFilters = async () => {
    setDateCreationFrom("");
    setDateCreationTo("");
    setUserAmountFrom("");
    setUserAmountTo("");
    setTermSearch("");
    setRegexSearch("");
    await programmingList.search();
  }

  return (
    <>
      <Box component="div">
        <form onSubmit={onSubmit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h6" gutterBottom>
              Filters and Queries
            </Typography>
            <Typography variant="body1" gutterBottom>
              Date creation range
            </Typography>
            <Box component="div" sx={dateRange}>
              <DatePicker
                label="Date from"
                name="date-from"
                type="date"
                variant="outlined"
                value={dateCreationFrom}
                sx={inputStyle}
                slotProps={{ textField: { size: 'small', name: "date-from" } }}
                onChange={(value) => {
                  setDateCreationFrom(dayjs(value));
                }}
              />
              <div>-</div>
              <DatePicker
                label="Date to"
                name="date-to"
                type="date"
                variant="outlined"
                value={dateCreationTo}
                sx={inputStyle}
                slotProps={{ textField: { size: 'small', name: "date-to" } }}
                onChange={(value) => {
                  setDateCreationTo(dayjs(value));
                }}
              />
            </Box>
            <Typography variant="body1" gutterBottom>
              Amount of users range
            </Typography>
            <Box component="div" sx={dateRange}>
              <TextField
                label="From"
                name="users-amount-from"
                type="number"
                variant="outlined"
                size="small"
                sx={inputStyle}
                value={userAmountFrom}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value < 0) {
                    setUserAmountFrom(0);
                  }
                  else {
                    setUserAmountFrom(value);
                  }
                }}
              />
              <div>-</div>
              <TextField
                label="To"
                name="users-amount-to"
                type="number"
                variant="outlined"
                size="small"
                sx={inputStyle}
                value={userAmountTo}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10);
                  if (value < 0) {
                    setUserAmountTo(0);
                  }
                  else {
                    setUserAmountTo(value);
                  }
                }}
              />
            </Box>
            <Typography variant="body1" gutterBottom>
              Term search (programming language)
            </Typography>
            <TextField
              hiddenLabel
              name="term-search"
              variant="outlined"
              size="small"
              value={termSearch}
              sx={{ ...inputStyle, width: "100%" }}
              onChange={(e) => {
                setTermSearch(e.target.value);
              }}
            />
            <Typography variant="body1" gutterBottom>
              Regex search (paradigm)
            </Typography>
            <TextField
              hiddenLabel
              name="regex-search"
              variant="outlined"
              size="small"
              value={regexSearch}
              sx={{ ...inputStyle, width: "100%" }}
              onChange={(e) => {
                setRegexSearch(e.target.value);
              }}
            />
            <Typography variant="body1" gutterBottom>
              Full text search (match for selected field)
            </Typography>
            <Select
              hiddenLabel
              name="full-text-search-select"
              variant="outlined"
              size="small"
              value={matchSearchField}
              sx={{ ...inputStyle, width: "100%" }}
              onChange={(e) => {
                setMatchSearchField(e.target.value);
              }}
            >
              <MenuItem value={"description"}>Description</MenuItem>
              <MenuItem value={"history"}>History</MenuItem>
              <MenuItem value={"usage"}>Usage</MenuItem>
            </Select>
            <TextField
              hiddenLabel
              name="full-text-search"
              variant="outlined"
              size="small"
              value={matchSearchQuery}
              sx={{ ...inputStyle, width: "100%" }}
              onChange={(e) => {
                setMatchSearchQuery(e.target.value);
              }}
            />
          </LocalizationProvider>
          <Button variant="outlined" sx={button} onClick={handleClearFilters}>Clear</Button>
          <Button type="submit" variant="contained" sx={{ ...button, float: "right" }}>Apply</Button>
        </form>
      </Box>
    </>
  )
}

export default Filters;