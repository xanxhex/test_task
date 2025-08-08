import React, { useEffect, useState } from "react";
import { getPositions } from "@/api/positions";

export default function PositionRadios({ value, onChange }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    getPositions().then(res => setPositions(res.positions)).catch(console.error);
  }, []);

  return (
    <fieldset>
      <legend>Select your position</legend>
      {positions.map(p => (
        <label key={p.id} style={{ display: "block", marginBottom: 8 }}>
          <input
            type="radio"
            name="position_id"
            value={p.id}
            checked={value === p.id}
            onChange={() => onChange(p.id)}
          />{" "}
          {p.name}
        </label>
      ))}
    </fieldset>
  );
}