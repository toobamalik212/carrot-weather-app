"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { cities, type City } from "@/data/cities";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddCityDialogProps {
  savedSlugs: string[];
  onAddCity: (city: City) => void;
}

export function AddCityDialog({ savedSlugs, onAddCity }: AddCityDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Only offer cities that aren't already on the homepage
  const availableCities = cities.filter(
    (city) => !savedSlugs.includes(city.slug)
  );

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelectedCity(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedCity) {
      return;
    }

    onAddCity(selectedCity);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Plus />
        Add city
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Add a city</DialogTitle>
            <DialogDescription>
              Search for a city to see its weather on your homepage.
            </DialogDescription>
          </DialogHeader>

          <Combobox
            items={availableCities}
            value={selectedCity}
            onValueChange={setSelectedCity}
            itemToStringLabel={(city: City) => city.name}
          >
            <ComboboxInput placeholder="Search cities..." className="w-full" />
            <ComboboxContent>
              <ComboboxEmpty>No cities found.</ComboboxEmpty>
              <ComboboxList>
                {(city: City) => (
                  <ComboboxItem key={city.slug} value={city}>
                    {city.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={!selectedCity}>
              Add city
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
