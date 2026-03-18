"use client";
import { useState } from "react";
import styles from "../ui-library.module.scss";

interface CodeBlockProps {
  code: string;
}

export const CodeBlock = ({ code }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.codeBlock}>
      <button className={styles.copyBtn} onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </div>
  );
};
