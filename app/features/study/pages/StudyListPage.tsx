import { useStudyListQuery } from "@study/api/studyListApi";
import { Badge } from "@study/components/ui/badge";
import { Button } from "@study/components/ui/button";
import { Card, CardContent } from "@study/components/ui/card";
import Header from "@study/components/ui/Header";
import { cn } from "@study/lib/utils";
import {
  StudyCategoryLabels,
  StudyLevelLabels,
  type StudyListItem,
} from "@study/types/study";
import { BarChart3, Clock, User, Users } from "lucide-react";
import { memo } from "react";

const SKELETON_COUNT = 6;

function SkeletonLine({ className }: { className?: string }) {
  return <div className={cn("rounded bg-gray-200 animate-pulse", className)} />;
}

function StudyCardSkeleton() {
  return (
    <div className="flex h-[280px] w-full min-w-[250px] flex-col gap-6 rounded-2xl border border-gray-200 bg-white py-6 shadow-[0_4px_20px_rgba(11,16,34,0.08)]">
      <div className="flex h-full flex-col p-6">
        <div className="flex flex-1 flex-col space-y-3">
          <SkeletonLine className="h-5 w-16" />
          <SkeletonLine className="h-6 w-3/4" />
          <div className="flex-1 space-y-3 text-sm">
            <div className="flex items-center">
              <SkeletonLine className="mr-2 h-4 w-4 shrink-0" />
              <SkeletonLine className="h-4 w-20" />
            </div>
            <div className="flex items-center">
              <SkeletonLine className="mr-2 h-4 w-4 shrink-0" />
              <SkeletonLine className="h-4 w-32" />
            </div>
            <div className="flex items-center">
              <SkeletonLine className="mr-2 h-4 w-4 shrink-0" />
              <SkeletonLine className="h-4 w-16" />
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-between gap-2">
            <div className="flex items-center text-sm">
              <SkeletonLine className="mr-2 h-4 w-4 shrink-0" />
              <SkeletonLine className="h-4 w-16" />
            </div>
            <SkeletonLine className="h-5 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface StudyCardProps {
  study: StudyListItem;
  onViewStudyDetail: (studyId: number) => void;
}

const StudyCard = memo(({ study, onViewStudyDetail }: StudyCardProps) => {
  const isOpen =
    study.participantCount < study.maxParticipants ||
    study.maxParticipants === 0;

  const handleClick = () => {
    onViewStudyDetail(study.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onViewStudyDetail(study.id);
    }
  };

  return (
    <Card
      className="relative h-[280px] w-full min-w-[250px] cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(11,16,34,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(11,16,34,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3b82f6]"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={study.title}
    >
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex flex-1 flex-col space-y-3">
          <div>
            <Badge
              variant="secondary"
              className={
                isOpen
                  ? "bg-blue-50 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }
            >
              {isOpen ? "모집중" : "모집완료"}
            </Badge>
          </div>

          <h3 className="line-clamp-2 font-semibold text-gray-900 text-lg leading-tight">
            {study.title}
          </h3>

          <div className="flex-1 space-y-3 text-gray-500 text-sm">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 shrink-0" />
              <span>{StudyLevelLabels[study.level]}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{study.schedule}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 shrink-0" />
              <span>
                {study.maxParticipants === 0
                  ? "제한 없음"
                  : `${study.participantCount}/${study.maxParticipants}명`}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center text-gray-500 text-sm">
              <User className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">{study.instructor}</span>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-gray-200 text-gray-500"
            >
              #{StudyCategoryLabels[study.category]}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

StudyCard.displayName = "StudyCard";

interface StudyListMainProps {
  onCreateStudy: () => void;
  onViewStudyDetail: (studyId: number) => void;
}

const StudyList = ({
  onCreateStudy,
  onViewStudyDetail,
}: StudyListMainProps) => {
  const { data: studies = [], isLoading: loading, error } = useStudyListQuery();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <div className="mb-6 flex w-full justify-end px-6 pt-6">
        <Button
          onClick={onCreateStudy}
          className="group relative overflow-hidden bg-gradient-to-br from-[#3b82f6] to-[#2563eb] px-6 py-2.5 text-white font-semibold shadow-[0_4px_20px_rgba(59,130,246,0.4),0_8px_32px_rgba(59,130,246,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:from-[#2563eb] hover:to-[#1d4ed8] hover:shadow-[0_6px_28px_rgba(59,130,246,0.5),0_12px_40px_rgba(59,130,246,0.3)] rounded-full"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          >
            <span
              aria-hidden="true"
              className="h-56 w-56 scale-0 transform rounded-full bg-white opacity-0 transition-opacity transition-transform duration-500 ease-out group-hover:scale-100 group-hover:opacity-20 motion-reduce:transform-none motion-reduce:transition-none"
            />
          </span>
          <span className="relative z-10">스터디 개설하기</span>
        </Button>
      </div>
      <main className="mx-auto max-w-7xl items-center px-6 pb-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <StudyCardSkeleton key={`skeleton-${String(i)}`} />
            ))
          ) : error ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <div className="text-red-500">
                스터디 목록을 불러오는데 실패했습니다.
              </div>
            </div>
          ) : studies.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <div className="text-gray-500">개설된 스터디가 없습니다.</div>
            </div>
          ) : (
            studies.map((study: StudyListItem) => (
              <StudyCard
                key={study.id}
                study={study}
                onViewStudyDetail={onViewStudyDetail}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

StudyList.displayName = "StudyList";

export default StudyList;
