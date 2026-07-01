interface ConsentState {
  regulations: boolean;
  privacy: boolean;
}

interface Chapter {
  id: string;
  title: string;
  articles: Article[];
}

interface Article {
  number: number;
  title: string;
  content: string | string[];
}

const chapters: Chapter[] = [
  {
    id: "general",
    title: "제1장 총칙",
    articles: [
      {
        number: 1,
        title: "명칭",
        content: "본회의 명칭은 Aegis(이하 본회)라 한다.",
      },
      {
        number: 2,
        title: "목적",
        content:
          "본회는 학술동아리로서 모든 구성원의 보안과 개발 분야의 역량 증진을 목표로 한다.",
      },
    ],
  },
  {
    id: "membership",
    title: "제2장 회원",
    articles: [
      {
        number: 3,
        title: "회원의 정의",
        content:
          "회비를 납부하고 본회에 가입 의사를 전달한 자는 본회의 회원이 된다.",
      },
      {
        number: 4,
        title: "회원의 권리",
        content: [
          "모든 회원은 동등한 권리를 지니며 본회의 모든 활동에 참여할 권리를 가진다.",
          "모든 회원은 본회의 발전을 위하여 자유롭게 의견을 개진할 권리를 가진다.",
          "모든 회원은 성별, 국적, 인종, 지역, 나이, 사회적 신분, 지식수준, 외모, 장애, 질병 등으로 차별받지 아니할 권리를 가진다.",
          "모든 회원은 동아리실에 출입할 권리를 가진다.",
        ],
      },
      {
        number: 5,
        title: "회원의 의무",
        content: [
          "모든 회원은 대한민국 법률, 단국대학교 학칙, 단국대학교 총동아리연합회 회칙, 본회 회칙, 가이드라인, 운영진 회의에 의해 의결된 사항을 준수할 의무를 가진다.",
          "모든 회원은 서로 배려하고 존중할 의무를 가진다.",
          "모든 회원은 본회의 활동에 적극적으로 참여할 의무를 가진다.",
        ],
      },
      {
        number: 6,
        title: "탈퇴와 회비의 반환",
        content:
          "회비를 납부하고 본회의 그 어떠한 활동에 참여하지 않고 7일 이내에 본회의 운영진에게 탈퇴 의사를 전달한 경우 회비를 반환한다.",
      },
    ],
  },
  {
    id: "operating",
    title: "제3장 운영진",
    articles: [
      {
        number: 7,
        title: "운영진의 정의",
        content: "본회를 대표하고 운영하는 단체를 운영진이라 한다.",
      },
      {
        number: 8,
        title: "운영진의 구성과 역할",
        content: [
          "운영진은 회장, 부회장, 운영위원으로 구성된다.",
          "회장은 본회와 운영진을 대표하고 운영진 회의의 안건을 의결한다.",
          "부회장은 회장 궐위시 그 권한을 대행한다.",
          "운영위원의 종류와 책임은 운영진 회의를 통해 의결한다.",
        ],
      },
      {
        number: 9,
        title: "운영진의 선출",
        content: [
          "다음 학기 회장의 선출은 운영진 회의에서 의결하며 이 외의 운영진은 다음 학기 회장이 선출한다.",
          "회장과 부회장이 모두 궐위시 운영진 회의를 통해 권한 대행을 선출한다.",
        ],
      },
      {
        number: 10,
        title: "운영진의 권리",
        content: [
          "운영진은 본회를 대표하여 본회의 활동을 결정하고 추진할 권리를 가진다.",
          "운영진은 본회의 원활한 운영을 위하여 필요에 따라 운영진 회의를 거쳐 회칙을 변경할 권리를 가진다.",
        ],
      },
      {
        number: 11,
        title: "운영진의 의무",
        content: [
          "운영진은 제5조 회원의 의무를 준수할 의무를 가진다.",
          "운영진은 본회를 제2조 목적에 맞게 운영할 의무를 가진다.",
          "운영진은 본회의 회비 및 기타 수입을 투명하게 관리할 의무를 가진다.",
          "운영진은 본회의 회계 내역을 학기 말에 공개할 의무를 가진다.",
        ],
      },
    ],
  },
  {
    id: "disciplinary",
    title: "제4장 징계",
    articles: [
      {
        number: 12,
        title: "징계의 대상",
        content:
          "본회의 회칙을 위반한 경우 운영진의 판단 하에 회원에게 징계를 부과한다.",
      },
      {
        number: 13,
        title: "징계의 종류",
        content:
          "징계의 종류에는 경고, 제적, 영구제적이 있으며, 경고를 받은 회원은 운영진의 판단 하에 활동이 제한될 수 있다.",
      },
    ],
  },
  {
    id: "accounting",
    title: "제5장 회계",
    articles: [
      {
        number: 14,
        title: "회계연도",
        content: "본회의 회계연도는 한 학기에 준하는 것을 원칙으로 한다.",
      },
      {
        number: 15,
        title: "회비",
        content:
          "본회의 회비는 15,000원으로 하되 활동 내역에 따라 할인 또는 면제될 수 있다.",
      },
    ],
  },
  {
    id: "privacy",
    title: "제6장 개인정보",
    articles: [
      {
        number: 16,
        title: "개인정보의 활용",
        content:
          "본 회의 가입 과정에서 제출된 개인정보는 동아리 운영을 위하여 사용될 수 있으며, 운영진은 개인정보 보호를 위하여 노력하여야 한다.",
      },
    ],
  },
];

export type { Article, Chapter, ConsentState };
export { chapters };
