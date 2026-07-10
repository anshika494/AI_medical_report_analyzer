"use client";

import React from "react";
import { Info } from "lucide-react";

export function Footer() {
  return (
    <footer style={styles.footerContainer}>
      <a href="#" style={styles.footerLeftLink}>
        <Info style={{ width: 16, height: 16 }} />
        <span style={styles.footerInfoText}>How BioBalance analyzes reports</span>
      </a>
      <div style={styles.footerRight}>
        <a href="#" style={styles.footerLink}>Privacy Policy</a>
        <a href="#" style={styles.footerLink}>Terms of Service</a>
        <a href="#" style={styles.footerLink}>Support</a>
      </div>
    </footer>
  );
}

const styles = {
  footerContainer: {
    display: "flex",
    flexDirection: "row" as const,
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #c2c8c2",
    marginTop: "auto", // Push footer to very bottom of flex container
    width: "100%",
    boxSizing: "border-box" as const,
  },
  footerLeftLink: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(45, 59, 45, 0.55)",
    fontSize: "14px",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  footerInfoText: {
    fontSize: "14px",
  },
  footerRight: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  footerLink: {
    color: "rgba(45, 59, 45, 0.4)",
    fontSize: "12px",
    letterSpacing: "0.05em",
    textDecoration: "none",
    textTransform: "uppercase" as const,
    fontWeight: "700",
    transition: "color 0.2s ease",
  },
};
