import Link from "next/link";
import React from "react";
import styles from "./NavBar.module.scss";
import { clsx } from "clsx";
import Logo from '../icons/logo.svg'

interface Props extends React.PropsWithChildren {
  title?: string;
  small?: boolean;
}

export function NavBar({ title, small, children }: Props) {
  return (
    <header className={clsx(styles.container, small && styles.small)}>
      <Link
        href="/"
        className={styles.link}
        style={{
          justifyContent: !title && !children ? "center" : undefined
        }}
      >
        <Logo/>
      </Link>

      {title && (
        <h2>{title}</h2>
      )}

      {children && (
        <div className={styles.children}>
          {children}
        </div>
      )}
    </header>
  );
}
