# Scripts

이 디렉토리는 프로젝트의 자동화 스크립트를 관리합니다.

## 📁 구조

```
scripts/
├── README.md           # 이 파일
└── git/               # Git 관련 스크립트
    ├── README.md
    ├── QUICK-START.md
    ├── commit-analysis.md
    ├── commit-all.sh
    └── commit-messages/
        ├── t007-i18n.txt
        ├── t008-pdf.txt
        ├── job-order-api.txt
        └── api-docs.txt
```

## 🚀 Git Commit 자동화

현재 변경사항을 자동으로 commit하는 스크립트:

```bash
./scripts/git/commit-all.sh
```

### 주요 기능
- ✅ 5개 기능별 commit 자동 생성
- ✅ .gitignore 자동 업데이트
- ✅ 일관된 commit 메시지
- ✅ Push 자동화 (선택)

### 빠른 시작
상세 가이드는 `scripts/git/QUICK-START.md` 참고

## 📚 문서

- **QUICK-START.md**: 빠른 시작 가이드
- **README.md**: 전체 사용 가이드
- **commit-analysis.md**: 변경사항 분석

## 💡 향후 계획

앞으로 추가될 스크립트:

- `scripts/deploy/`: 배포 자동화
- `scripts/test/`: 테스트 자동화
- `scripts/build/`: 빌드 최적화
- `scripts/db/`: 데이터베이스 마이그레이션

## 🎯 Best Practices

### 스크립트 작성 규칙

1. **실행 가능**: `chmod +x script.sh`
2. **에러 처리**: 실패 시 명확한 메시지
3. **사용자 확인**: 중요 작업 전 확인
4. **문서화**: README.md 작성
5. **테스트**: 로컬에서 충분히 테스트

### 디렉토리 구조

```
scripts/
├── {category}/          # 기능별 분류
│   ├── README.md       # 상세 문서
│   ├── main-script.sh  # 메인 스크립트
│   └── helpers/        # 헬퍼 스크립트
```

## 📝 사용 예시

### Git Commit

```bash
# 전체 자동 commit
./scripts/git/commit-all.sh

# 개별 commit (수동)
git add <files>
git commit -F scripts/git/commit-messages/t007-i18n.txt
```

## 🔧 트러블슈팅

### 권한 오류

```bash
chmod +x scripts/git/commit-all.sh
```

### 경로 오류

항상 프로젝트 루트에서 실행:

```bash
cd /mnt/d/Dev/BEP
./scripts/git/commit-all.sh
```

## 🎉 기여하기

새 스크립트를 추가하려면:

1. 적절한 카테고리 디렉토리 생성
2. README.md 작성
3. 스크립트 작성 및 테스트
4. 이 파일에 문서 추가

## 📞 도움이 필요하신가요?

- Git 스크립트: `scripts/git/README.md`
- 빠른 시작: `scripts/git/QUICK-START.md`
- 문제 보고: GitHub Issues
