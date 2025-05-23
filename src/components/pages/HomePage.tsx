"use client";

import {useRouter} from "next/navigation";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import {toast, Toaster} from "react-hot-toast";
import {NavBar} from "@/components/NavBar/NavBar";
import {Input} from "@/components/Input/Input";
import KeyIcon from "@/components/icons/key.svg";
import {Button} from "@/components/Button";
import styles from './Index.module.scss';
import {Footer} from "@/components/Footer/Footer";
import { IsAuthorizedWrapper } from '@/lib/dtel-auth/components/IsAuthorizedWrapper';
import { LoginButton } from '@/lib/dtel-auth/components';
import { Leaderboard } from '@/lib/dtel-common/Leaderboard/Leaderboard';
import { getCookie, setCookie } from '@/app/actions';
import { Loader } from '@dtelecom/components-react';

export default function Home() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    getCookie("roomName").then((cookie) => {
      setRoomName(cookie || "");
    });
  }, []);

  const joinRoom = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (roomName === "") {
      toast.error("Please enter a room name");
      return;
    }
    try {
      setIsLoading(true);

      await setCookie("roomName", roomName, window.location.origin);
      router.push(`/createRoom?roomName=${encodeURIComponent(roomName)}`);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }, [roomName, router]);

  return (
    <>
      <Toaster/>
      <NavBar>
        <IsAuthorizedWrapper>
          <Leaderboard
            buttonStyle={{
              marginRight: "8px"
            }}
          />
        </IsAuthorizedWrapper>

        <LoginButton fullTitle />
      </NavBar>

      <div className={styles.container}>
        <h1 className={styles.title}>Create a Spatial Meeting<br/>and Get Points</h1>

        <p className={styles.text}>{'Free, open-source, 2D world where you can\ninteract, see, and hear others with spatial\nstereo audio. Powered by '}<a
          href={'https://video.dtelecom.org/'}
          target={'_blank'}
          rel={'noreferrer'}
        >dTelecom Cloud</a></p>

        <form onSubmit={(e) => void joinRoom(e)}>
          <Input
            placeholder={"Enter a room name"}
            value={roomName}
            setValue={setRoomName}
            startIcon={<KeyIcon/>}
          />
          <Button
            type={"submit"}
            variant={"default"}
            size={"lg"}
            className={styles.button}
            disabled={!roomName || isLoading || roomName.length < 3}
          >
            {isLoading ? <Loader /> : "Create a Room"}
          </Button>
        </form>
      </div>

      <Footer/>
    </>
  );
}
