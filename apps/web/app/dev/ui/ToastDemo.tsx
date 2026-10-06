"use client";
import { Button, useToast } from "@tempest/ui";
export function ToastDemo() {
  const toast = useToast();
  return <div className="row"><Button variant="secondary" onClick={() => toast("Profile saved")}>Show toast</Button></div>;
}
