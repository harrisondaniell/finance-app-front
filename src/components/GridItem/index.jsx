import React from "react";
import * as C from "./styles";
import {
  FaRegArrowAltCircleUp,
  FaRegArrowAltCircleDown,
  FaTrash,
} from "react-icons/fa";

const GridItem = ({ item, onDelete }) => {
  {
    item.amount = Number(item.amount);
  }
  return (
    <C.Tr>
      <C.Td>{item.name || item.desc}</C.Td>{" "}
      <C.Td>R$ {+item.amount.toFixed(2)}</C.Td>
      <C.Td alignCenter>
        {item.type === "EXPENSE" ? (
          <FaRegArrowAltCircleDown color="red" />
        ) : (
          <FaRegArrowAltCircleUp color="green" />
        )}
      </C.Td>
      <C.Td alignCenter>
        <FaTrash onClick={() => onDelete(item.id)} />
      </C.Td>
    </C.Tr>
  );
};

export default GridItem;
