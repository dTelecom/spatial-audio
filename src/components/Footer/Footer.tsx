import styles from "./Footer.module.scss";
import DtelecomIcon from "../icons/dTelecom.svg";

export const Footer = () => {
  return (
    <div className={styles.container}>
      Powered by<a href={'https://dtelecom.org/'} target={'_blank'} rel={'noreferrer'}><DtelecomIcon /></a>
    </div>
  );
};
