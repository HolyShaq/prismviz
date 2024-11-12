import { Skeleton } from "@mui/material";

// TODO: Set global css properties

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      {/* Ribbon */}
      <div className="flex flex-row w-full space-x-4 px-4 bg-[#d9d9d9]">
        {/* Icon */}
        <img src="favicon.ico" alt="logo" className="w-16 h-16 my-4" />

        {/* Ribbon Toolbar */}
        <div className="flex flex-col space-y-1 my-3 w-full">
          <div className="flex flex-row space-x-2 font-sans text-sm">
            <text>File</text>
            <text>Home</text>
            <text>Help</text>
          </div>

          <Skeleton
            variant="rectangular"
            animation={false}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-row h-full">
        {/* Sidebar */}
        <div className="flex flex-col space-y-2 p-2 outline outline-1 outline-[#d9d9d9]">
          {[...Array(3)].map((i) => (
            <Skeleton
              id={i}
              variant="rectangular"
              animation={false}
              className="w-8 h-8"
            />
          ))}
        </div>

        {/* Content */}
        <div className="h-full w-full">
          <ContentTemplate />
        </div>
      </div>
    </div>
  );
}

// TODO: Delete once dedicated components for pages have been made
function ContentTemplate() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <text className="text-2xl font-bold">Content Goes Here</text>
    </div>
  );
}
