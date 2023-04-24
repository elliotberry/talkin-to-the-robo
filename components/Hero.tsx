import {
  createStyles,
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  Modal,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandGithub, IconCheck } from "@tabler/icons-react";
import KeyModal from "./KeyModal";

const useStyles = createStyles((theme) => ({
  inner: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: `calc(${theme.spacing.xl} * 4)`,
    paddingBottom: `calc(${theme.spacing.xl} * 4)`,
  },

  content: {
    maxWidth: rem(480),
    marginRight: `calc(${theme.spacing.xl} * 3)`,

    [theme.fn.smallerThan("md")]: {
      maxWidth: "100%",
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(44),
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      flex: 1,
    },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  highlight: {
    position: "relative",
    backgroundColor: theme.fn.variant({
      variant: "light",
      color: theme.primaryColor,
    }).background,
    borderRadius: theme.radius.sm,
    padding: `${rem(4)} ${rem(12)}`,
  },
}));

export default function Hero() {
  const { classes } = useStyles();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              <span className={classes.highlight}>GraceGPT</span>
            </Title>
            <Text color="dimmed" mt="md">
              A simple, locally running ChatGPT UI.
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={rem(12)} stroke={1.5} />
                </ThemeIcon>
              }
            >
              <List.Item>
                <b>本地浏览器运行</b> – 无需安装其他应用
                applications
              </List.Item>
              <List.Item>
                <b>比官方UI更快</b> – 直接连接到 API
              </List.Item>
              <List.Item>
                <b>简单的麦克风集成</b> – 如需打字，解放双手
              </List.Item>
              <List.Item>
                <b>使用你自己的 API key</b> – 没有API KEY可在下方按钮自助获取
              </List.Item>
            </List>

            <Group mt={30}>
              <Button
                radius="xl"
                size="md"
                className={classes.control}
                onClick={open}
              >
                填入 API Key
              </Button>
              <Button
                component="a"
                href="https://faka.aihub.ren/buy/42"
                variant="default"
                radius="xl"
                size="md"
                className={classes.control}
                
              >
                Digital Shop
              </Button>
            </Group>
          </div>
        </div>
        <Modal opened={opened} onClose={close} title="API Key">
          <KeyModal close={close} />
        </Modal>
      </Container>
    </div>
  );
}
