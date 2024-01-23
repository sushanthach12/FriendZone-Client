import AddFriendButton from "@/components/AddFriendButton"

type Props = {}

const AddFriends = (props: Props) => {

  return (
    <main className='pt-8'>
        <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
        <AddFriendButton />
    </main>
  )
}

export default AddFriends