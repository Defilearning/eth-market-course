import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnCourseCard } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/courses/fetcher";
import { useRouter } from "next/router";
import { Fragment } from "react";
import Link from "next/link";
import { useWeb3 } from "@components/providers";

export default function OwnedCourses({ courses }) {
  const router = useRouter();
  const { requireInstall } = useWeb3();
  const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  return (
    <Fragment>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.isEmpty && (
          <div>
            <div className="w-1/2">
              <Message type="warning">
                <div>You don&apos;t own any courses</div>
                <Link href="/marketplace">
                  <a className="font-normal hover:underline">
                    <i>Purchase Course</i>
                  </a>
                </Link>
              </Message>
            </div>
          </div>
        )}
        {account.isEmpty && (
          <div>
            <div className="w-1/2">
              <Message type="warning">
                <div>Please connect to metamask</div>
              </Message>
            </div>
          </div>
        )}
        {requireInstall && (
          <div>
            <div className="w-1/2">
              <Message type="warning">
                <div>Please intsall metamask</div>
              </Message>
            </div>
          </div>
        )}
        {ownedCourses.data?.map((course) => (
          <OwnCourseCard key={course.id} course={course}>
            <Button onClick={() => router.push(`/courses/${course.slug}`)}>
              Watch the course
            </Button>
          </OwnCourseCard>
        ))}
      </section>
    </Fragment>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();

  return {
    props: {
      courses: data,
    },
  };
}

OwnedCourses.Layout = BaseLayout;
