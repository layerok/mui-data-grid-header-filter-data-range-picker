import {
  GridFilterItem,
  GridRenderHeaderFilterProps,
  useGridApiContext,
} from "@mui/x-data-grid-premium";
import { useCallback, useState } from "react";
import {
  DateRange,
  DateRangePicker,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { TextField } from "@mui/material";

export const DateRangeHeaderFilter = (props: GridRenderHeaderFilterProps) => {
  const { item, inputRef } = props;
  const apiRef = useGridApiContext();

  const [range, setRange] = useState<DateRange<dayjs.Dayjs>>([null, null]);
  const applyFilterChanges = useCallback(
    (updatedItem: GridFilterItem) => {
      if (item.value && !updatedItem.value) {
        apiRef.current.deleteFilterItem(updatedItem);
      } else {
        apiRef.current.upsertFilterItem(updatedItem);
      }
    },
    [apiRef, item],
  );

  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <DateRangePicker
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      inputRef={inputRef as any}
      value={range}
      onError={(range) => {
        setHasError(range.some((item) => item != null));
      }}
      onChange={(range) => {
        setRange(range);
        const [start, end] = range;
        setHasError(
          (start != null && end == null) || (end != null && start == null),
        );
        applyFilterChanges({
          ...item,
          value:
            start?.isValid() && end?.isValid()
              ? start.format("YYYY-MM-DD") + "," + end.format("YYYY-MM-DD")
              : null,
        });
      }}
      slots={{
        field: SingleInputDateRangeField,
        textField: TextField,
      }}
      slotProps={{
        field: {
          clearable: true,
          onClear: () => {
            setRange([null, null]);
          },
        },
        textField: {
          variant: "standard",

          error: hasError && !open,

          sx: {
            marginTop: "16px",
            width: "220px",
          },
        },
      }}
    />
  );
};
