import { useAccount, useOwnedCourse } from "@components/hooks/web3";
import { useWeb3 } from "@components/providers";
import { Message, Modal } from "@components/ui/common";
import { Curriculum, CourseHero, KeyPoints } from "@components/ui/course";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/courses/fetcher";
import { Fragment } from "react";

export default function Course({ course }) {
  const { isLoading } = useWeb3();
  const { account } = useAccount();
  const { ownedCourse } = useOwnedCourse(course, account.data);
  const courseState = ownedCourse.data?.state;
  // const courseState = "deactivated";

  const isLocked =
    !courseState ||
    courseState === "purchased" ||
    courseState === "deactivated";

  return (
    <Fragment>
      <div className="py-4">
        <CourseHero
          hasOwner={!!ownedCourse.data}
          title={course.title}
          description={course.description}
          image={course.coverImage}
        />
      </div>
      <KeyPoints points={course.wsl} />

      {courseState && (
        <div className="max-w-5xl mx-auto">
          {courseState === "purchased" && (
            <Message type="warning">
              Course is purchased and waiting for the activation. Process can
              take up to 24 hours.{" "}
              <i className="block font-normal">
                In case of any questions, please contat info@eincode.com
              </i>
            </Message>
          )}
          {courseState === "activated" && (
            <Message type="success">
              Eincode wishes you happy watching of the course.
            </Message>
          )}
          {courseState === "deactivated" && (
            <Message type="danger">
              Course has been deactivated, due to incorrect purchase data. The
              functionality to watch the course has been temporary disabled.{" "}
              <i className="block font-normal">
                Please contat info@eincode.com
              </i>
            </Message>
          )}
        </div>
      )}
      <Curriculum
        locked={isLocked}
        courseState={courseState}
        isLoading={isLoading}
      />
      <Modal />
    </Fragment>
  );
}

export function getStaticPaths() {
  const { data } = getAllCourses();

  return {
    paths: data.map((c) => ({
      params: {
        slug: c.slug,
      },
    })),
    fallback: false,
  };
}

export function getStaticProps({ params }) {
  const { data } = getAllCourses();

  const course = data.filter((el) => el.slug === params.slug)[0];

  return {
    props: {
      course,
    },
  };
}

Course.Layout = BaseLayout;
