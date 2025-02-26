"use client"

import { useContext } from "react";
import { AuthModalContext } from "../providers/auth-modal-provider";

export const useAuthModal = () => useContext(AuthModalContext);
