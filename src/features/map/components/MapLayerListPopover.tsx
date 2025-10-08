import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayersIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { mapActions, type GeoJsonDataSource } from "@/redux/slices/mapSlice";

type MapLayerItem = {
  source: GeoJsonDataSource;
  visible: boolean;
};

export const MapLayerListPopover = () => {
  const [open, setOpen] = useState(false);

  const geoJsonDataSources = useAppSelector(
    (state) => state.map.geoJsonDataSources
  );

  const layerItems: MapLayerItem[] = geoJsonDataSources.map((source) => ({
    source: source,
    visible: true,
  }));

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <LayersIcon />
          <span className="sr-only">Map Layers</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0"
        align="start"
        // Prevent closing on outside click or ESC
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="px-4 py-2 border-b">
          <span className="font-medium text-sm">Map Layers</span>
        </div>
        <ScrollArea className="h-32">
          <div className="p-2 space-y-2">
            {layerItems.map((item) => (
              <MapLayerItem key={item.source.id} {...item} />
            ))}
          </div>
        </ScrollArea>
        {/* Add a close button */}
        <div className="p-2 border-t flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const MapLayerItem = (item: MapLayerItem) => {
  const dispatch = useAppDispatch();

  return (
    <label
      key={item.source.id}
      className="flex items-center gap-2 cursor-pointer"
    >
      <Checkbox
        checked={item.source.visibleToMap}
        onCheckedChange={() => {
          dispatch(mapActions.toggleLayerVisibility({ id: item.source.id }));
        }}
        id={`layer-checkbox-${item.source.id}`}
      />
      <span className="text-sm">{item.source.layerName}</span>
    </label>
  );
};
