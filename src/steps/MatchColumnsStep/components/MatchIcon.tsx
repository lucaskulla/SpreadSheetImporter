import { Box, chakra, Flex } from "@chakra-ui/react"
import { dataAttr } from "@chakra-ui/utils"
import { motion } from "framer-motion"
import { CheckCircleIcon } from "@chakra-ui/icons"


const MotionFlex = motion(Flex)

const animationConfig = {
  transition: {
    duration: 0.1,
  },
  exit: { scale: 0.5, opacity: 0 },
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
}
type MatchIconProps = {
  isChecked: boolean
}

export const MatchIcon = (props: MatchIconProps) => {
  //const style = useStyleConfig("MatchIcon", props)
  return (
    <chakra.div
      // __css={style}
      minW={6}
      minH={6}
      w={6}
      h={6}
      ml="0.875rem"
      mr={3}
      data-highlighted={dataAttr(props.isChecked)}
      data-testid="column-checkmark"
    >
      {props.isChecked && (
        <MotionFlex {...animationConfig}>
          <CheckCircleIcon w={7} h={7} color="green" />
        </MotionFlex>
      )}

      {!props.isChecked && (
        <MotionFlex {...animationConfig}>
          <Box
            boxSize="6"
            borderRadius="full"
            border="2px"
            borderColor="green"
            bg="transparent"
          />
        </MotionFlex>
      )}

    </chakra.div>
  )
}
