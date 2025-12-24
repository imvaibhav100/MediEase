
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import GenericMedicineInfo from "./GenericMedicineInfo";
import { Provider } from "react-redux";
import store from "../store";

jest.mock("axios");

describe("GenericMedicineInfo UI", () => {
  it("shows generic alternatives table for valid branded medicine", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { name: "Azithromycin 250mg Tablet", company: "GenericCo", mrp: 45, composition: "Azithromycin 250mg" },
        { name: "Azithral 250mg Tablet", company: "Alembic", mrp: 60, composition: "Azithromycin 250mg" }
      ]
    });

    render(
      <Provider store={store}>
        <GenericMedicineInfo />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/private medicine/i), { target: { value: "Azithral" } });
    fireEvent.click(screen.getByText(/find generic alternative/i));

    await waitFor(() => screen.getByText(/generic alternatives found/i));
    expect(screen.getByText("Azithromycin 250mg Tablet")).toBeInTheDocument();
    expect(screen.getByText("Azithral 250mg Tablet")).toBeInTheDocument();
    expect(screen.getByText(/lowest price/i)).toBeInTheDocument();
  });

  it("shows fallback message if no alternatives exist", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });
    render(
      <Provider store={store}>
        <GenericMedicineInfo />
      </Provider>
    );
    fireEvent.change(screen.getByPlaceholderText(/private medicine/i), { target: { value: "UnknownMed" } });
    fireEvent.click(screen.getByText(/find generic alternative/i));
    await waitFor(() => screen.getAllByText(/no generic alternative found/i));
    expect(screen.getAllByText(/no generic alternative found/i)).toHaveLength(2);
  });
});
