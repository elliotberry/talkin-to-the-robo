import { useState } from "react";
import {
  Button,
  Group,
  Box,
  Loader,
  Tabs,
  px,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { testKey as testKeyOpenAI } from "@/stores/OpenAI";
import { testKey as testKey11Labs } from "@/stores/ElevenLabs";
import { testKey as testKeyAzure } from "@/stores/AzureSDK";

import { useChatStore } from "@/stores/ChatStore";
import {
  IconBrandWindows,
  IconCheck,
  IconRobot,
  IconVolume,
  IconX,
} from "@tabler/icons-react";
import { update } from "@/stores/ChatActions";

export function APIPanel({
  name,
  initialKey,
  initialRegion,
  setKeyFun,
  setKeyFunRegion,
  descriptionAboveInput,
  descriptionBelowInput,
  validateKey,
  closeModal,
}: {
  name: string;
  initialKey: string | undefined;
  initialRegion?: string | undefined;
  setKeyFun: (key: string) => void;
  setKeyFunRegion?: (key: string) => void;
  descriptionAboveInput: string;
  descriptionBelowInput: React.ReactNode;
  validateKey: (key: string, region?: string) => Promise<boolean>;
  closeModal: () => void;
}) {
  const [checkStatus, setCheckStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [apiKey, setApiKey] = useState(initialKey);
  const [region, setRegion] = useState(initialRegion);

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckStatus("idle");
    setApiKey(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (apiKey) {
      setCheckStatus("loading");

      const keyValid = await validateKey(apiKey, region);

      if (keyValid) {
        notifications.show({
          message: "Key 已保存!",
          color: "green",
        });
        setKeyFun(apiKey);
        if (setKeyFunRegion && region) {
          setKeyFunRegion(region);
        }
        setCheckStatus("success");
      } else {
        notifications.show({
          message: "Something went wrong",
          color: "red",
        });
        setCheckStatus("error");
      }
    }
  };

  const iconMap = {
    idle: null,
    loading: <Loader size={px("1rem")} />,
    success: <IconCheck color="green" size={px("1rem")} />,
    error: <IconX color="red" size={px("1rem")} />,
  };
  const icon = iconMap[checkStatus];
  console.log(apiKey);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>🔑 {name}:</h2>
        <p>{descriptionAboveInput}</p>
        <PasswordInput
          label="API Key"
          placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxx"
          icon={icon}
          value={apiKey}
          onChange={handleKeyChange}
        />
        {setKeyFunRegion && (
          <TextInput
            label="Region"
            placeholder="westus"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
          />
        )}
        {descriptionBelowInput}
        <Group position="right" mt="md">
          <Button
            type="submit"
            disabled={initialKey === apiKey && initialRegion === region}
          >
            保存
          </Button>
          <Button onClick={closeModal} variant="light">
            取消
          </Button>
        </Group>
      </form>
    </div>
  );
}

export default function KeyModal({ close }: { close: () => void }) {
  const apiKeyOpenAI = useChatStore((state) => state.apiKey);
  const apiKey11Labs = useChatStore((state) => state.apiKey11Labs);
  const apiKeyAzure = useChatStore((state) => state.apiKeyAzure);
  const apiKeyAzureRegion = useChatStore((state) => state.apiKeyAzureRegion);

  const setApiKeyOpenAI = (key: string) => update({ apiKey: key });
  const setApiKeyAzure = (key: string) => update({ apiKeyAzure: key });
  const setApiKeyAzureRegion = (region: string) =>
    update({ apiKeyAzureRegion: region });
  const setApiKey11Labs = (key: string) => update({ apiKey11Labs: key });

  return (
    <div>
      <Box mx="auto">
        <Tabs defaultValue="openai">
          <Tabs.List>
            <Tabs.Tab value="openai" icon={<IconRobot size={px("0.8rem")} />}>
              OpenAI
            </Tabs.Tab>
            <Tabs.Tab
              value="azure"
              icon={<IconBrandWindows size={px("0.8rem")} />}
            >
              Azure
            </Tabs.Tab>
            <Tabs.Tab value="11labs" icon={<IconVolume size={px("0.8rem")} />}>
              Eleven Labs
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="openai" pt="xs">
            <APIPanel
              name="填入你的 OpenAI API Key"
              initialKey={apiKeyOpenAI}
              setKeyFun={setApiKeyOpenAI}
              descriptionAboveInput="您需要一个OpenAI API密钥。您的API密钥存储在本地的浏览器上，永远不会被发送到其他地方。如果您没有API KEY，可在这里自助获取："
              <a
                    target="_blank"
                    href="https://faka.aihub.ren"
                  >
                    Digital Shop
                  </a>.
              descriptionBelowInput={
                <p>
                  → 如果您有账号请登官网获取API：{" "}
                  <a
                    target="_blank"
                    href="https://platform.openai.com/account/api-keys"
                  >
                    OpenAI dashboard
                  </a>
                  .
                </p>
              }
              validateKey={testKeyOpenAI}
              closeModal={close}
            />
          </Tabs.Panel>
          <Tabs.Panel value="azure" pt="xs">
            <APIPanel
              name="输入您的 Azure Speech API Key"
              initialKey={apiKeyAzure}
              initialRegion={apiKeyAzureRegion}
              setKeyFun={setApiKeyAzure}
              setKeyFunRegion={setApiKeyAzureRegion}
              descriptionAboveInput="如果您想使用 TTS via Azure, 您需要一个 Azure Speech API Key。 您的API密钥存储在本地的浏览器上，永远不会被发送到其他地方。 请注意，成本估算对Azure无效，所以请注意您的使用情况！"
              descriptionBelowInput={
                <p>
                  → Azure 对注册用户提供200美元的免费积分：{" "}
                  <a
                    target="_blank"
                    href="https://carldesouza.com/get-a-microsoft-cognitive-services-subscription-key/"
                  >
                    This guide explains the steps.
                  </a>
                </p>
              }
              validateKey={testKeyAzure}
              closeModal={close}
            />
          </Tabs.Panel>
          <Tabs.Panel value="11labs" pt="xs">
            <APIPanel
              name="输入您的 Eleven Labs API Key"
              initialKey={apiKey11Labs}
              setKeyFun={setApiKey11Labs}
              descriptionAboveInput="如果您想使用 TTS via Eleven Labs, 您需要一个 Eleven Labs API Key。 您的API密钥存储在本地的浏览器上，永远不会被发送到其他地方。 请注意，成本估算不适用于 ElevenLabs，所以请注意您的使用情况！"
              descriptionBelowInput={
                <p>
                  → 从您的ElevenLabs中获取API密钥：{" "}
                  <a
                    target="_blank"
                    href="https://beta.elevenlabs.io/speech-synthesis"
                  >
                    ElevenLabs profile
                  </a>
                  .
                </p>
              }
              validateKey={testKey11Labs}
              closeModal={close}
            />
          </Tabs.Panel>
        </Tabs>
      </Box>
    </div>
  );
}
