import { AddIcon, EditIcon } from '@chakra-ui/icons'


type EditOrAddIconProps = {
  isEdit: boolean
}

export const EditOrAddIcon = ({ isEdit }: EditOrAddIconProps) => {
  const Icon = isEdit ? EditIcon : AddIcon

  return <Icon w={6} h={6}  />
}
