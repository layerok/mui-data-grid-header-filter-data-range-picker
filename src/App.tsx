import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";
import {
  DataGridPremium,
  GridColDef,
  GridFilterOperator,
} from "@mui/x-data-grid-premium";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import "dayjs/locale/de";
import dayjs from "dayjs";
import { DateRangeHeaderFilter } from "./DateRangerHeaderFilter.tsx";

const betweenDateRangeFilterOperator: GridFilterOperator = {
  label: "",
  value: "between-date-range",
  headerLabel: "",
  getApplyFilterFn: (filterItem) => {
    if (!filterItem.field || !filterItem.value || !filterItem.operator) {
      return null;
    }
    const [startRaw, endRaw] = filterItem.value.split(",");
    const start = dayjs(startRaw || null);
    const end = dayjs(endRaw || null);
    if (!start.isValid() || !end.isValid()) {
      return null;
    }
    return (rawValue) => {
      const value = dayjs(rawValue);
      return value.isValid() && value.isAfter(start) && value.isBefore(end);
    };
  },
};

const rows = [
  {
    id: "33",
    first_name: "Volodymyr",
    birth_date: "2000-02-24",
  },
  {
    id: "34",
    first_name: "Yaroslav",
    birth_date: "2002-03-11",
  },
];

const columns: GridColDef[] = [
  {
    headerName: "First name",
    field: "first_name",
    minWidth: 200,
  },
  {
    headerName: "Birth date",
    field: "birth_date",
    minWidth: 270,
    renderHeaderFilter: DateRangeHeaderFilter,
    filterOperators: [betweenDateRangeFilterOperator],
  },
];

const muiTheme = createTheme({});
function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"de"}>
        <MuiThemeProvider theme={muiTheme}>
          <DataGridPremium headerFilters rows={rows} columns={columns} />
        </MuiThemeProvider>
      </LocalizationProvider>
    </>
  );
}

export default App;
