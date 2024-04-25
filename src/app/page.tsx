export default async function Home() {
  return (
    <div className="page items-center justify-center space-y-8 px-4 text-center md:space-y-6 md:px-8 md:!pt-40 lg:space-y-4 lg:!pt-32">
      <div>
        <h1 className={`text-center text-4xl text-[40px] md:text-5xl`}>
          Create a private token index
          <br />
          <span className="xs:text-6xl text-destructive text-5xl font-bold md:text-6xl">
            while you eat a fruit
          </span>
        </h1>
      </div>
      <div className="lg:max-w-xl">
        <h3 className={`text-2xl sm:text-[2rem]`}>
          Where everyone can create, discover and DCA into a custom token index
        </h3>
      </div>
    </div>
  )
}
