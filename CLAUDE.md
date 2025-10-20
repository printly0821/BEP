
## Important
- Always anwer in korea
- Always write utf-8 encoding
- Always make the service user-initiated

---

## Development & Testing Rules

### Testing
- **User performs all testing**: 사용자가 직접 테스트를 수행합니다
- **Claude provides commands only**: 테스트가 필요한 경우 명령어만 제공합니다
- **Never run test commands automatically**: 자동으로 테스트를 실행하지 않습니다

### Development Server (WSL)
- **NEVER run `npm run dev` in WSL**: WSL 환경에서 좀비 프로세스가 발생합니다
- **User runs dev server**: 사용자가 직접 개발 서버를 실행합니다
- **Never use background Bash for dev server**: 백그라운드로 dev 서버를 실행하지 않습니다
- **Only provide ready-to-run commands**: 실행 준비된 명령어만 제공합니다

### Implementation Workflow
1. **설계 (Design)**: 요구사항 분석 및 아키텍처 설계
2. **분석 (Analysis)**: 코드베이스 탐색 및 영향도 분석
3. **기획 (Planning)**: Task 단위로 구현 계획 수립
4. **구현 (Implementation)**: 코드 작성 및 TypeScript 컴파일 확인
5. **명령어 제공 (Commands)**: 테스트 및 실행 명령어 제공
6. **사용자 테스트 (User Testing)**: 사용자가 직접 테스트 수행

---

<vooster-docs>
- @./vooster-docs/prd.md
- @./vooster-docs/architecture.md
- @./vooster-docs/guideline.md
- @./vooster-docs/design-guide.md
- @./vooster-docs/ia.md
- @./vooster-docs/step-by-step.md
- @./vooster-docs/clean-code.md
</vooster-docs>
