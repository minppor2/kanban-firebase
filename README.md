# 수업용 칸반보드 (Firebase)

`PRD.md` 기획에 따라 만든 교실용 칸반보드입니다. React + Vite + TypeScript + Tailwind CSS 프론트엔드에서 Firebase Firestore로 실시간 동기화합니다.

## 이번 단계 범위

- ✅ Firestore 데이터 연동 + 실시간 동기화 (`onSnapshot`)
- ✅ 학급 생성/참여, 교사 공지 보드(초안↔공개), 학생 개인 보드(카드 공개/비공개, 드래그 재정렬)
- ❌ 실제 로그인 화면 / Firebase Auth 연동 — 대신 **목업 사용자 컨텍스트**로 화면 상단의 "보기: 교사/학생" 전환기를 통해 고정된 교사·학생 프로필을 즉시 사용합니다 (`src/hooks/useCurrentUser.ts`). 나중에 실제 Auth로 교체할 때는 이 파일 내부만 바꾸면 됩니다.
- ❌ `firestore.rules` / `firestore.indexes.json`은 스캐폴드만 되어 있고 **배포되지 않았습니다** (실제 Auth가 없어 규칙이 참조할 `request.auth`가 없기 때문). 실제 프로젝트에 연결한 뒤 참고용으로 검토·배포하세요.

## 시작하기

```bash
npm install
npm run dev
```

Firebase 프로젝트 설정 없이도 모든 화면을 둘러볼 수 있습니다 — 다만 데이터 저장/조회는 동작하지 않고 상단에 노란 배너가 표시됩니다.

### 실제 Firestore 연동하기

1. [Firebase 콘솔](https://console.firebase.google.com/)에서 새 프로젝트를 만들고, 웹 앱을 추가해 설정값을 확인합니다.
2. **Firestore Database**를 생성합니다 (테스트 모드로 시작해도 되고, 이번 단계 코드는 클라이언트에서 직접 `where(ownerId==uid)`처럼 스코프를 좁혀 쿼리하므로 테스트 모드에서도 동작합니다).
3. `.env.example`을 복사해 `.env.local`을 만들고 값을 채웁니다.

   ```bash
   cp .env.example .env.local
   ```

4. 서버를 재시작하면 (`npm run dev`) 노란 배너가 사라지고 실시간 동기화가 동작합니다.

## 종단간 검증 체크리스트

`.env.local` 설정 후 아래 흐름을 직접 확인하세요.

1. 상단 "보기"를 **교사**로 두고 `/teacher`에서 학급을 만든다 → Firestore 콘솔에서 `classes`, `joinCodes`, `memberships`, `users` 문서가 생겼는지 확인.
2. 참여 코드를 복사한다.
3. "보기"를 **학생**으로 전환 후 `/join`에서 코드를 입력해 참여한다 → 기본 목록 3개("할 일"/"진행중"/"완료")가 자동 생성되는지 확인.
4. 학생 화면에서 카드를 추가/수정/삭제하고, "선생님께 공개"로 전환해본다.
5. "보기"를 **교사**로 전환 → `/teacher/roster`에서 학생 클릭 → 공개로 전환한 카드만 보이고 비공개 카드는 보이지 않는지 확인.
6. 교사 공지 보드에서 카드를 만들고 "비공개(초안)" 상태로 둔 뒤, 학생 화면(`/board`)에는 보이지 않는지 확인 → "공개하기"로 전환 → 두 번째 브라우저 탭을 열어둔 학생 화면에 실시간으로 나타나는지 확인 (onSnapshot).
7. 학생 보드에서 카드를 드래그로 재정렬한 뒤 새로고침해도 순서가 유지되는지 확인.
8. `/teacher/schedule`에서 일정을 추가/저장하고 학생 화면(`/board`)에 위젯으로 표시되는지 확인.

## 프로젝트 구조

```
src/
  lib/firebase.ts        Firebase 초기화 (.env 기반, 미설정 시에도 안전)
  types/models.ts         Firestore 컬렉션별 문서 타입
  contexts/, hooks/        목업 사용자 컨텍스트 (useCurrentUser)
  features/class/          학급 생성/참여
  features/board/          재사용 가능한 칸반 보드 (BoardPage + 드래그 재정렬)
  features/teacher/        교사 대시보드/명단/일정/학생 열람
  features/student/        학생 홈 (개인 보드 + 공지 + 일정)
firestore.rules           보안 규칙 스캐폴드 (미배포)
firestore.indexes.json    복합 인덱스 플레이스홀더
```
