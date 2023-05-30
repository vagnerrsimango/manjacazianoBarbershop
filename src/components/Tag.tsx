import MyButton from './MyButton';
interface ITag {
  title: string;
}
export default function Tag({ title }: ITag) {
  return (
    <MyButton
      title={title}
      bg="primary.400"
      mr={2}
      rounded={'4'}
      weight="900"
    />
  );
}
