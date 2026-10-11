"use client";

import { useSyncExternalStore } from "react";

const profileImageEvent = "bazardor:profile-image-change";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(profileImageEvent, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(profileImageEvent, onChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem("profileImage");
}

function getServerSnapshot() {
  return null;
}

export function useProfileImage() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function saveProfileImage(image: string) {
  window.localStorage.setItem("profileImage", image);
  window.dispatchEvent(new Event(profileImageEvent));
}
