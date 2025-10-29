// ToggleEyes.tsx
'use client'
import React from "react";
import { Eye, EyeClosed } from 'lucide-react';

type ToggleEyesProps = {
  eyes: boolean;
  setEyes: React.Dispatch<React.SetStateAction<boolean>>;
};

function ToggleEyes({ eyes, setEyes }: ToggleEyesProps) {
  return (
    <span style={{top:'10px', right:'10px'}}
      onClick={() => setEyes(!eyes)} 
      className="cursor-pointer select-none absolute"
    >
      {eyes ? <Eye /> : <EyeClosed /> }
    </span>
  );
}

export default React.memo(ToggleEyes);
