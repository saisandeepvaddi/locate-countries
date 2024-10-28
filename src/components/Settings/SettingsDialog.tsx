"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Theme } from "@/lib/themes";
import { projectionAtom, themeAtom } from "@/state/settings";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { Globe, Laptop, Map, Moon, Settings, Sun } from "lucide-react";
import MapboxKeyInput from "./MapboxKeyInput";

export default function SettingsDialog() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [projection, setProjection] = useAtom(projectionAtom);

  const handleThemeChange = (value: Theme) => {
    setTheme(value);
  };

  const handleProjectionChange = (value: "mercator" | "globe") => {
    setProjection(value);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"}>
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projection" className="text-right">
              Projection
            </Label>
            <Tabs
              value={projection}
              onValueChange={(value) =>
                handleProjectionChange(value as "mercator" | "globe")
              }
            >
              <TabsList>
                <TabsTrigger value="mercator">
                  <Map className="mr-2 h-4 w-4" /> Mercator
                </TabsTrigger>
                <TabsTrigger value="globe">
                  <Globe className="mr-2 h-4 w-4" /> Globe
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theme" className="text-right">
              Theme
            </Label>
            <Select onValueChange={handleThemeChange} value={theme}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <MapboxKeyInput />
          <div className="v-center">
            <Button
              id="github"
              variant="outline"
              className="w-full gap-2"
              onClick={() =>
                window.open(
                  "https://github.com/saisandeepvaddi/locate-countries",
                  "_blank",
                )
              }
            >
              <GitHubLogoIcon className="h-4 w-4" />
              View on GitHub
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
