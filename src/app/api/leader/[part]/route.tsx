import { BACKEND_URL } from "@/app/constants/common";
import { NextRequest, NextResponse } from "next/server";

// GET 함수의 두 번째 인자에서 context 타입을 정확하게 정의
export async function GET(
  request: NextRequest,
  { params }: { params: { part: string } } // params는 { part: string }으로 정확히 정의
): Promise<NextResponse> {
  const { part } = params; // params에서 part 값 추출

  // part가 없으면 에러 처리
  if (!part) {
    return NextResponse.json(
      { error: "Bad Request: Missing part parameter" },
      { status: 400 }
    );
  }

  const { headers } = request;
  const token = headers.get("Authorization");

  try {
    if (!token) {
      console.error("Authorization header is missing");
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // URL 설정
    const url = `${BACKEND_URL}/${part === "team" ? "" : "leader/"}${part}`;
    console.log(`Fetching data from: ${url}`);

    // API 요청 보내기
    const response = await fetch(url, {
      headers: { Authorization: token },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Unexpected error occurred:", error.message);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
    console.error("Unexpected error occurred:", error);
    return NextResponse.json(
      { error: "Internal server error", details: "Unknown error" },
      { status: 500 }
    );
  }
}
