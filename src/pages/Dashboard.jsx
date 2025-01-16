const Dashboard = ({ user }) => {
  if (!user) {
    return <p>Please sign in</p>
  }

  return (
    <>
      <h1>Welcome, {user?.username}</h1>
      <p>
        This is the dashboard page where you, and only you, can see a dashboard
        of all of your things.
      </p>
      <a href={`email:+${user?.email}`}>My email {user?.email}</a>
    </>
  )
}

export default Dashboard
