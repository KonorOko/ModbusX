import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useSettings, {
  AddressLayout,
  Settings,
  Theme,
} from "@/hooks/useSettings";
import { SettingsLayout } from "@/layouts/settings-layout";
import { error } from "@tauri-apps/plugin-log";
import { Header } from "./components/header";
import {
  SettingsContent,
  SettingsDescription,
  SettingsItem,
  SettingsSection,
  SettingsSectionTitle,
  SettingsTitle,
} from "./components/settings";

export function SettingsPage() {
  const settings = useSettings((state) => state.settings);
  const updateSetting = useSettings((state) => state.updateSetting);

  const handleUpdate = async (
    key: string,
    value: (typeof settings)[keyof Settings],
  ) => {
    try {
      await updateSetting(key as keyof Settings, value);
    } catch (e) {
      error(`Failed to update setting ${key}:${e}`);
    }
  };

  return (
    <SettingsLayout>
      <Header />
      <SettingsSection className="p-4">
        <SettingsSectionTitle>General</SettingsSectionTitle>
        <SettingsItem>
          <SettingsContent>
            <SettingsTitle>Language</SettingsTitle>
            <SettingsDescription>
              Choose the language of the application
            </SettingsDescription>
          </SettingsContent>
          <Select defaultValue="en">
            <SelectTrigger>
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
        <SettingsItem>
          <SettingsContent>
            <SettingsTitle>Format value</SettingsTitle>
            <SettingsDescription>
              Choose the format of the value field
            </SettingsDescription>
          </SettingsContent>
          <Select defaultValue="decimal">
            <SelectTrigger>
              <SelectValue placeholder="Select a format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="decimal">Decimal</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
        <SettingsItem>
          <SettingsContent>
            <SettingsTitle>Read-only Mode</SettingsTitle>
            <SettingsDescription>
              Enable read-only mode to prevent editing (secure mode).
            </SettingsDescription>
          </SettingsContent>
          <Switch
            checked={settings.readOnly}
            onCheckedChange={(value) =>
              handleUpdate("readOnly", Boolean(value))
            }
          />
        </SettingsItem>
      </SettingsSection>
      <SettingsSection className="p-4">
        <SettingsSectionTitle>Appearance</SettingsSectionTitle>
        <SettingsItem>
          <SettingsContent>
            <SettingsTitle>Address Layout</SettingsTitle>
            <SettingsDescription>
              Choose the layout of the address field
            </SettingsDescription>
          </SettingsContent>
          <Select
            value={settings.addressLayout}
            onValueChange={(value) =>
              handleUpdate("addressLayout", value as AddressLayout)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select A Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="table">Table</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
        <SettingsItem>
          <SettingsContent>
            <SettingsTitle>Theme</SettingsTitle>
            <SettingsDescription>Theme of the application</SettingsDescription>
          </SettingsContent>
          <Select
            value={settings.theme}
            onValueChange={(value) => handleUpdate("theme", value as Theme)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
      </SettingsSection>
    </SettingsLayout>
  );
}

export default SettingsPage;
