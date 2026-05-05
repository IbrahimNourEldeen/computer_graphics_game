#include <GL/glut.h>
#include "DDA.h"
#include "Bresenham.h"
#include "MidPoint.h"

void display()
{
    glClear(GL_COLOR_BUFFER_BIT);

    DDA dda;
    Bresenham bres;
    MidPoint mid;

    glColor3f(1.0, 0.0, 0.0);
    dda.draw(-150, 150, 150, 100);

    glColor3f(0.0, 1.0, 0.0);
    bres.draw(-150, 100, 150, 0);

    glColor3f(0.0, 0.0, 1.0);
    mid.draw(-150, 120, 150, 100);

    glFlush();
}

void init()
{
    glClearColor(0.0, 0.0, 0.0, 1.0);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    gluOrtho2D(-200, 200, -200, 200);
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowSize(500, 500);
    glutCreateWindow("Line Generation Algorithms");
    init();
    glutDisplayFunc(display);
    glutMainLoop();
    return 0;
}