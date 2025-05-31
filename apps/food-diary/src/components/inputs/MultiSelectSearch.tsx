import React, { useState, useRef, MouseEvent } from "react";
import styles from "./MultiSelectSearch.module.scss";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    TextField,
    Popover,
    ListItem
} from "@mui/material";

interface MultiSelectSearchProps {
    values: string [];
    options: string [];
    onChange: (newValues: string[]) => void;
    onSearch: (searchTerm: string) => void;

}

const MultiSelectSearch: React.FC<MultiSelectSearchProps> = ({
                                                                 values = [],
                                                                 options = [],
                                                                 onChange,
                                                                 onSearch
                                                             }: any) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const inputRef = useRef<HTMLDivElement>(null);

    const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const closeMenu = (_: any, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason === "backdropClick" || reason === "escapeKeyDown")
            setAnchorEl(null);
    };

    return (
        <div className={styles.select}>
            <Button
                variant="outlined"
                disableRipple
                onClick={openMenu}
            >
                {values.length} Lebensmittel ausgewählt
            </Button>
            <Popover
                disablePortal
                keepMounted
                open={Boolean(anchorEl)}
                onAnimationEnd={() => {
                    if (anchorEl) inputRef.current?.focus();
                }}
                anchorEl={anchorEl}
                onClose={closeMenu}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center"
                }}
            >
                <Box sx={{ padding: "7px", height: "fit-content" }}>
                    <Autocomplete
                        inputValue={searchValue}
                        style={{ width: 350 }}
                        multiple
                        clearOnBlur={false}
                        disableCloseOnSelect={true}
                        disableClearable
                        autoHighlight={false}
                        popupIcon={null}
                        options={options}
                        value={values}

                        onChange={(event, newValues) => {
                            event.preventDefault();
                            setSearchValue("");
                            onChange(newValues);
                        }}
                        noOptionsText="Keine passende Lebensmittel gefunden"
                        renderOption={(props, option, { selected }) => (
                            <ListItem {...props} key={option}>
                                <Checkbox style={{ marginRight: "7px" }} checked={selected} />
                                {option}
                            </ListItem>
                        )}
                        // Listening to ESC key to close the popover
                        onKeyDown={(event) => {
                            if (event.key === "Escape") {
                                setAnchorEl(null);
                            }
                        }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    placeholder="Suche"
                                    inputRef={inputRef}
                                    onBlur={() => {
                                        setAnchorEl(null);
                                        return params.inputProps.onBlur;
                                    }}
                                    onKeyDown={(event: any) => {
                                        // As the autocomplete uses tags by default, backspace removes selection 1 by 1 if
                                        // no text is present in the search bar. To remove that behavior we prevent propagating the
                                        // event
                                        if (event.key === "Backspace") {
                                            event.stopPropagation();
                                        }
                                    }}
                                    onChange={(event) => {
                                        onSearch(event.target.value);
                                        setSearchValue(event.target.value);
                                    }}
                                />
                            );
                        }}

                    />
                </Box>
            </Popover>
        </div>
    );
};

export default MultiSelectSearch;