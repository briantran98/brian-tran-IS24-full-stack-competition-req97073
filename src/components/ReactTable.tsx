import { Product, ProductResponse, ReactTableNodes } from "@/interfaces";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/mantine";
import ToolTipButton from "./ToolTipButton";
import { ChangeEvent, MouseEvent, useState } from "react";

/**
 * Table built with react-table that has built in search function and styling
 * @param values type ProductResponse. The data that would fill the table
 * @param addButtonHandler type callback (event: MouseEvent<HTMLButtonElement>, product?: Product). Callback to pass to the tooltipbutton component
 * @returns JSX.Element
 */
export default function ReactTable({
  values,
  addButtonHandler,
}: {
  values: ProductResponse;
  addButtonHandler: (
    event: MouseEvent<HTMLButtonElement>,
    product?: Product
  ) => void;
}): JSX.Element {
  const [search, setSearch] = useState("");

  // Setting the values for the table
  const nodes = values.result;

  // Themeing the table with 3rd party theme with customizations
  const mantineTheme = getTheme(DEFAULT_OPTIONS);
  mantineTheme.Table =
    "overflow: unset; grid-template-rows: none; grid-template-columns: minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, 1fr) minmax(0px, .6fr) minmax(0px, 5em);";
  mantineTheme.BaseRow = "padding: 10rem";
  mantineTheme.HeaderCell = "border-bottom: 1px rgb(231, 231, 231) solid;";
  const theme = useTheme(mantineTheme);
  if (!nodes) return <></>;

  // Assigning here to guarantee that nodes isn't null
  let data: ReactTableNodes = { nodes };

  // Controlled component function for the search/filter
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  // Search function that will render the table
  data = {
    nodes: data.nodes.filter((item) =>
      item.scrumMasterName?.toLowerCase().includes(search.toLowerCase())
    ),
  };

  const COLUMNS = [
    {
      label: "Product Number",
      renderCell: (item: Product) => (item as Product).productId,
    },
    {
      label: "Product Name",
      renderCell: (item: Product) => (item as Product).productName,
    },
    {
      label: "Scrum Master",
      renderCell: (item: Product) => (item as Product).scrumMasterName,
    },
    {
      label: "Product Owner",
      renderCell: (item: Product) => (item as Product).productOwnerName,
    },
    {
      label: "Developers",
      renderCell: (item: Product) =>
        (item as Product).developers?.map((developer, index) => (
          <p key={index}>{developer}</p>
        )),
    },
    {
      label: "Start Date",
      renderCell: (item: Product) =>
        new Date((item as Product).startDate).toISOString().substring(0, 10),
    },
    {
      label: "Methodology",
      renderCell: (item: Product) => (item as Product).methodology,
    },
    {
      label: "",
      renderCell: (item: Product) => (
        <ToolTipButton onEditHandler={(e) => addButtonHandler(e, item)}>
          ...
        </ToolTipButton>
      ),
    },
  ];

  return (
    <>
      <label htmlFor="search">
        Search by Scrum Master:&nbsp;
        <input id="search" type="text" value={search} onChange={handleSearch} />
      </label>
      <br />

      <CompactTable
        columns={COLUMNS}
        data={data}
        theme={theme}
        layout={{ fixedHeader: true }}
      />

      <br />
    </>
  );
}
